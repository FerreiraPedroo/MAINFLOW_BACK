import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/database/prisma/prisma.service";

import { LocaStorageContextData } from "@/common/context/interfaces/local-storage-context.data";
import { LocalStorageContextService } from "@/common/context/local-storage-context.service";

import { UserRecord } from "../types/data/user-record";
import { CreateUserData } from "../types/data/create-user.data";
import { User } from "@prisma/client";

@Injectable()
export class UserRepository {
  constructor(
    private prisma: PrismaService,
    private requestContext: LocalStorageContextService,
  ) {}

  async getUsers(): Promise<User[]> {
    const userData = this.requestContext.getStore() as LocaStorageContextData;

    return await this.prisma.user.findMany({
      where: {
        business_unit_id: Number(userData.businessUnitId),
      },
    });
  }
  async createUser(user: CreateUserData): Promise<User | null> {
    const userData = this.requestContext.getStore() as LocaStorageContextData;

    return await this.prisma.user.create({
      data: {
        ...user,
        created_by: Number(userData.userId),
        business_unit_id: Number(userData.businessUnitId),
      },
    });
  }
  async getUserByEmail(email: string): Promise<UserRecord | null> {
    const userData = this.requestContext.getStore() as LocaStorageContextData;

    return await this.prisma.user.findUnique({
      where: {
        business_unit_id_email: {
          email,
          business_unit_id: Number(userData.businessUnitId),
        },
      },
      include: {
        business_unit: true,
        user_session: true,
      },
    });
  }

  async getLoggedUser(): Promise<UserRecord | null> {
    const userData = this.requestContext.getStore() as LocaStorageContextData;

    return await this.prisma.user.findUnique({
      where: {
        id: Number(userData.userId),
        business_unit_id: Number(userData.businessUnitId),
      },
      include: {
        business_unit: true,

        user_session: true,
      },
    });
  }
}
