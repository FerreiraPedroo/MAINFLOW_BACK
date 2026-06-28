import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  async userLogin(user: string) {
    return await this.prisma.user.findFirst({
      where: { email: user },
    });
  }
}
