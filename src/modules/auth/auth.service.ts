import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "@modules/user/user.service";

import {
  AuthUserDepartmentSectorData,
  SectorItem,
} from "./interfaces/departments.interface";
import { EncryptService } from "@/common/service/encrypt.service";
import { DepartmentService } from "@modules/manager/department/department.service";
import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { env } from "node:process";

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
      await this.departmentService.findUserDepartmentSectorByUserIdForLogin(
        userFound.id,
        userFound.business_unit_id,
      );

    const departmentsInfo: AuthUserDepartmentSectorData[] = [];

    if (departmentsSectors) {
      for (const userDepartmentSector of departmentsSectors) {
        const foundDepartmentInfo = departmentsInfo.find(
          (dpto) => dpto.id == userDepartmentSector.department_id,
        );

        if (foundDepartmentInfo) {
          if (userDepartmentSector.sector_id) {
            const foundSector = foundDepartmentInfo.itemsList.find(
              (sector): sector is SectorItem =>
                sector.id === userDepartmentSector.sector_id &&
                "process_item" in sector,
            );

            if (foundSector) {
              foundSector.process_item.push(userDepartmentSector.process_item);
            } else {
              foundDepartmentInfo.itemsList.push({
                ...(userDepartmentSector.sector as SectorItem),
                process_item: [userDepartmentSector.process_item],
              });
            }
          } else {
            foundDepartmentInfo.itemsList.push(
              userDepartmentSector.process_item,
            );
          }
        } else {
          const newDepartment: AuthUserDepartmentSectorData = {
            id: userDepartmentSector.id,
            title: userDepartmentSector.department.title,
            url: userDepartmentSector.department.url,
            icon: userDepartmentSector.department.icon,
            itemsList: [],
          };

          if (userDepartmentSector.sector) {
            newDepartment.itemsList.push({
              id: userDepartmentSector.sector.id,
              department_id: userDepartmentSector.sector.department_id,
              title: userDepartmentSector.sector.title,
              icon: userDepartmentSector.sector.icon,
              process_item: [userDepartmentSector.process_item],
            });
          } else {
            newDepartment.itemsList.push(userDepartmentSector.process_item);
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
