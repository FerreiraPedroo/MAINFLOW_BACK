import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "@modules/user/user.service";

import {
  AuthDepartmentSectorData,
  SectorItem,
} from "./interfaces/departments.interface";
import { EncryptService } from "@/common/service/encrypt.service";
import { DepartmentService } from "@modules/manager/department/department.service";
import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";

export interface JwtPayload {
  user: string;
  businessId: number;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private jwtService: JwtService,
    private encryptService: EncryptService,
    private userService: UserService,
    private departmentService: DepartmentService,
  ) {}

  async signIn(email: string, password: string) {
    const userFound = await this.userService.getUser(email);

    if (!userFound) {
      throw new UnauthorizedException("Senha ou usuário errado(s).");
    }

    const passwordCompare = await this.encryptService.compareHash(
      password,
      userFound.password,
    );

    if (!passwordCompare) {
      throw new UnauthorizedException("Senha ou usuário errado(s).");
    }

    const userInfo = {
      id: userFound.id,
      name: userFound.name,
      photo: userFound.photo,
      email: userFound.email,
    };

    const departmentsSectors =
      await this.departmentService.findDepartmentSectorByUserIdForLogin(
        userFound.id,
        userFound.business_unit_id,
      );

    const departmentsInfo: AuthDepartmentSectorData[] = [];

    if (departmentsSectors) {
      for (const departmentSector of departmentsSectors) {
        const foundDepartmentInfo = departmentsInfo.find(
          (dpto) => dpto.id == departmentSector.department_id,
        );

        if (foundDepartmentInfo) {
          if (departmentSector.sector_id) {
            const foundSector = foundDepartmentInfo.itemsList.find(
              (sector): sector is SectorItem =>
                sector.id === departmentSector.sector_id &&
                "process_item" in sector,
            );

            if (foundSector) {
              foundSector.process_item.push(departmentSector.process_item);
            } else {
              foundDepartmentInfo.itemsList.push({
                ...(departmentSector.sector as SectorItem),
                process_item: [departmentSector.process_item],
              });
            }
          } else {
            foundDepartmentInfo.itemsList.push(departmentSector.process_item);
          }
        } else {
          const newDepartment: AuthDepartmentSectorData = {
            id: departmentSector.id,
            title: departmentSector.department.title,
            url: departmentSector.department.url,
            icon: departmentSector.department.icon,
            itemsList: [],
          };

          if (departmentSector.sector) {
            newDepartment.itemsList.push({
              id: departmentSector.sector.id,
              department_id: departmentSector.sector.department_id,
              title: departmentSector.sector.title,
              icon: departmentSector.sector.icon,
              process_item: [departmentSector.process_item],
            });
          } else {
            newDepartment.itemsList.push(departmentSector.process_item);
          }

          departmentsInfo.push(newDepartment);
        }
      }
    }

    const tokenInfo = await this.generateToken(
      userFound.id,
      userFound.business_unit_id,
    );

    await this.cacheManager.set(
      `userId:${userFound.id}:businessId:${userFound.business_unit_id}`,
      departmentsSectors,
    );

    return { userInfo, tokenInfo, departmentsInfo };
  }

  async generateToken(userId: number, businessId: number): Promise<string> {
    const token = await this.jwtService.signAsync({
      payload: { userId, businessId },
    });

    return token;
  }
}
