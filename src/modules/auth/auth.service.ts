import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { JwtService } from "@nestjs/jwt";
import {
  Inject,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from "@nestjs/common";

import { EncryptService } from "@common/service/encrypt.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

import { UserActivityRepository } from "@modules/user/repositories/user-activity-repository";
import { UserRepository } from "@modules/user/repositories/user.repository";

import {
  AuthUserActivitiesData,
  SectorItem,
} from "./data/user-activities.data";
import { UserRecord } from "../user/types/data/user-record";
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
    private userRepository: UserRepository,
    private userActivityRepository: UserActivityRepository,
  ) {}

  private prismaErrors(error: any): never {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2001": {
          throw new UnprocessableEntityException(
            `O usuário não pode ser excluído.`,
          );
          break;
        }
        case "P2002": {
          const meta = error.meta?.driverAdapterError as any;
          const fields = meta?.cause?.constraint?.fields
            ?.join(" / ")
            .toUpperCase();

          throw new UnprocessableEntityException(
            `Existe um usuário com esses dados: ${fields}`,
          );
          break;
        }
        case "P2025": {
          throw new UnprocessableEntityException(
            "Não foi possivel encontrar o usuário.",
          );
        }
        default: {
          console.log(error);
          throw new UnprocessableEntityException(error.message);
        }
      }
    } else {
      console.log(error);
      throw new UnprocessableEntityException(
        "Não foi possivel executar a ação.",
      );
    }
  }

  async signIn(email: string, password: string) {
    let userRecord: UserRecord | null;
    try {
      userRecord = await this.userRepository.getLoginUserByEmail(email);
    } catch (error) {
      this.prismaErrors("Senha ou usuário errado(s).");
    }

    if (!userRecord) {
      throw new UnauthorizedException("Usuário ou senha errados.");
    }

    const passwordCompare = await this.encryptService.compareHash(
      password,
      userRecord.password,
    );

    if (!passwordCompare) {
      throw new UnauthorizedException("Senha ou usuário errados.");
    }

    const userInfo = {
      id: userRecord.id,
      name: userRecord.name,
      photo: userRecord.photo,
      email: userRecord.email,
    };

    const userActivities =
      await this.userActivityRepository.findUserActivitiesById(
        userRecord.id,
        userRecord.business_unit_id,
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
      userRecord.id,
      userRecord.business_unit_id,
    );

    await this.cacheManager.set(
      `userId:${userRecord.id}:businessId:${userRecord.business_unit_id}`,
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
