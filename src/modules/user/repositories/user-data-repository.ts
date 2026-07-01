import { PrismaService } from "@/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";


@Injectable()
export class UserDataRepository {
  constructor(private prisma: PrismaService) {}

  async getUserData(userId: number) {
    return await this.prisma.userData.findFirst({
      where: { user_id: userId },
    });
  }
}
