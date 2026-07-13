import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { UserService } from "@modules/user/user.service";
import { EncryptService } from "@/common/service/encrypt.service";

import {
  AuthUserActivitiesData,
  SectorItem,
} from "./interfaces/user-activities.data";

import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { UserDataRepository } from "../user/repositories/user-data-repository";
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
    private userDataRepository: UserDataRepository,
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

    const userActivities =
      await this.userDataRepository.findUserActivitiesByUserId(
        userFound.id,
        userFound.business_unit_id,
      );

    const userActivityInfo: AuthUserActivitiesData[] = [];

    if (userActivities) {
      for (const userActivity of userActivities) {
        const foundDepartmentInfo = userActivityInfo.find(
          (dpto) => dpto.id == userActivity.department_id,
        );

        if (foundDepartmentInfo) {
          if (userActivity.sector_id) {
            const foundSector = foundDepartmentInfo.activities.find(
              (sector): sector is SectorItem =>
                sector.id === userActivity.sector_id && "activities" in sector,
            );

            if (foundSector) {
              foundSector.activities.push(userActivity.activity);
            } else {
              foundDepartmentInfo.activities.push({
                ...(userActivity.sector as SectorItem),
                activities: [userActivity.activity],
              });
            }
          } else {
            foundDepartmentInfo.activities.push(userActivity.activity);
          }
        } else {
          const newDepartment: AuthUserActivitiesData = {
            id: userActivity.id,
            title: userActivity.department.title,
            url: userActivity.department.url,
            icon: userActivity.department.icon,
            activities: [],
          };

          if (userActivity.sector) {
            newDepartment.activities.push({
              id: userActivity.sector.id,
              department_id: userActivity.sector.department_id,
              title: userActivity.sector.title,
              icon: userActivity.sector.icon,
              activities: [userActivity.activity],
            });
          } else {
            newDepartment.activities.push(userActivity.activity);
          }

          userActivityInfo.push(newDepartment);
        }
      }
    }

    const tokenInfo = await this.generateToken(
      userFound.id,
      userFound.business_unit_id,
    );

    await this.cacheManager.set(
      `userId:${userFound.id}:businessId:${userFound.business_unit_id}`,
      userActivities,
    );

    return { userInfo, tokenInfo, userActivityInfo };
  }

  async generateToken(userId: number, businessId: number): Promise<string> {
    const token = await this.jwtService.signAsync({
      payload: { userId, businessId },
    });

    return token;
  }
}
