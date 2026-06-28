import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class UserDataRepository {
  constructor(private prisma: PrismaClient) {}

  async getUserData(userId: number) {
    return await this.prisma.userData.findFirst({
      where: { user_id: userId },
    });
  }
}
