import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "@modules/user/user.service";

import { AuthDepartmentSectorData } from "./interfaces/departments.interface";
import { EncryptService } from "@/common/service/encrypt.service";
import { DepartmentService } from "@modules/manager/department/department.service";

export interface JwtPayload {
  user: string;
  businessId: number;
}

@Injectable()
export class AuthService {
  constructor(
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
      await this.departmentService.findDepartmentSectorByUserId(
        userFound.id,
        userFound.business_unit_id,
      );

    const departmentsInfo: AuthDepartmentSectorData[] = [];

    if (departmentsSectors) {
      for (const departmentSector of departmentsSectors) {
        const foundDepartment = departmentsInfo.find(
          (dpto) => dpto.id == departmentSector.department_id,
        );

        if (foundDepartment) {
          if (departmentSector.sector) {
            const foundSector = foundDepartment.sector.find(
              (sector) => sector.id === departmentSector.sector_id,
            );

            if (foundSector) {
              foundSector.process_item.push(departmentSector.process_item);
            } else {
              foundDepartment.sector.push({
                ...departmentSector.sector,
                process_item: [departmentSector.process_item],
              });
            }
          } else {
            foundDepartment.process_item.push(departmentSector.process_item);
          }
        } else {
          const newDepartment: AuthDepartmentSectorData = {
            id: departmentSector.id,
            title: departmentSector.department.title,
            url: departmentSector.department.url,
            icon: departmentSector.department.icon,
            sector: [],
            process_item: [],
          };

          if (departmentSector.sector) {
            newDepartment.sector.push({
              id: departmentSector.sector.id,
              department_id: departmentSector.sector.department_id,
              title: departmentSector.sector.title,
              icon: departmentSector.sector.icon,
              process_item: [departmentSector.process_item],
            });
          }

          departmentsInfo.push(newDepartment);
        }
      }
    }

    const tokenInfo = await this.generateToken(
      userFound.email,
      userFound.business_unit_id,
    );


    /***
     * ADICIONAR INFORMAÇÕES AO REDIS E/OU CACHE
     */

    return { userInfo, tokenInfo, departmentsInfo };
  }

  async generateToken(user: string, businessId: number): Promise<string> {
    const token = await this.jwtService.signAsync({
      payload: { user, businessId },
    });

    return token;
  }

  async validateToken(token: string): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch {
      throw new UnauthorizedException({
        codStatus: 401,
        message: "Não foi possivel efetuar o login.",
      });
    }
  }
}
