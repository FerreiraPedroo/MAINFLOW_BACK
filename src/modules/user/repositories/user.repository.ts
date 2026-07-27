import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/database/prisma/prisma.service";

import { LocalStorageContextData } from "@/common/context/interfaces/local-storage-context.data";
import { LocalStorageContextService } from "@/common/context/local-storage-context.service";

import { UserRecord } from "../types/data/user-record";
import { CreaterequestContext } from "../types/data/create-user.data";
import { User } from "@prisma/client";

@Injectable()
export class UserRepository {
  constructor(
    private prisma: PrismaService,
    private requestContext: LocalStorageContextService,
  ) {}

  async getUsers(): Promise<User[]> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.prisma.user.findMany({
      where: {
        business_unit_id: requestContext.business_unit_id,
      },
    });
  }

  async createUser(user: CreaterequestContext): Promise<User | null> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.prisma.user.create({
      data: {
        ...user,
        created_by: Number(requestContext.userId),
        business_unit_id: Number(requestContext.business_unit_id),
      },
    });
  }
  async getUserByEmail(email: string): Promise<UserRecord | null> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.prisma.user.findUnique({
      where: {
        business_unit_id_email: {
          email,
          business_unit_id: Number(requestContext.business_unit_id),
        },
      },
      include: {
        business_unit: true,
        user_session: true,
      },
    });
  }
  async getLoggedUser(): Promise<UserRecord | null> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.prisma.user.findUnique({
      where: {
        id: Number(requestContext.userId),
        business_unit_id: Number(requestContext.business_unit_id),
      },
      include: {
        business_unit: true,

        user_session: true,
      },
    });
  }

  // SEM BUSINESS-ID
  // UTILIZADO PARA LOGIN
  async getLoginUserByEmail(email: string): Promise<UserRecord | null> {
    return await this.prisma.user.findUnique({
      where: { email },
      include: {
        business_unit: true,
        user_session: true,
      },
    });
  }
}
