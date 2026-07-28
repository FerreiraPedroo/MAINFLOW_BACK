import { UserService } from "./../user/user.service";
import {
  Inject,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

import { EncryptService } from "@common/service/encrypt.service";
import { UserActivityService } from "./../user/user-activity.service";

import { SectorItem } from "./data/user-activities.data";
import { UserRecord } from "../user/types/record/user-record";

import { AuthLoginInput, AuthLoginOutput, UserActivitiesInfo } from "./types";

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly encryptService: EncryptService,
    private readonly userActivityService: UserActivityService,
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

  async signIn(userInput: AuthLoginInput): Promise<AuthLoginOutput> {
    let userRecord: UserRecord | null;
    try {
      userRecord = await this.userService.getUserByEmail(userInput.email);
    } catch (error) {
      this.prismaErrors(error);
    }

    if (!userRecord) {
      throw new UnauthorizedException("Usuário ou senha errados.");
    }

    const passwordCompare = await this.encryptService.compareHash(
      userInput.password,
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

    const userActivities = await this.userActivityService.findUserActivities(
      userRecord.id,
    );

    const userActivityInfo: UserActivitiesInfo[] = [];

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
          const newDepartment: UserActivitiesInfo = {
            ...userActivity.department,
            activities: [],
          };

          if (userActivity.sector) {
            newDepartment.activities.push({
              ...userActivity.sector,
              activities: [],
            });
          } else {
            newDepartment.activities.push(userActivity.activity);
          }

          userActivityInfo.push(newDepartment);
        }
      }
    }

    const tokenInfo = await this.jwtService.signAsync({
      payload: {
        user_id: userRecord.id,
        business_id: userRecord.business_unit_id,
      },
    });

    await this.cacheManager.set(
      `user_id:${userRecord.id}:business_id:${userRecord.business_unit_id}`,
      userActivities,
    );

    return { userInfo, tokenInfo, userActivityInfo };
  }
}
