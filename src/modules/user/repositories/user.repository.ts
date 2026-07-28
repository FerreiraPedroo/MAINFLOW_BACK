import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";

import { PrismaService } from "@/database/prisma/prisma.service";

import { LocalStorageContextData } from "@/common/context/interfaces/local-storage-context.data";
import { LocalStorageContextService } from "@/common/context/local-storage-context.service";

import { CreateUserData, UserRecord } from "../types";

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

  async createUser(user: CreateUserData): Promise<User | null> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.prisma.user.create({
      data: {
        ...user,
        created_by: requestContext.user_id,
        business_unit_id: requestContext.business_unit_id,
      },
    });
  }
  async getUserByEmail(email: string): Promise<UserRecord | null> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.prisma.user.findUnique({
      where: {
        email,
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
        id: Number(requestContext.user_id),
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
