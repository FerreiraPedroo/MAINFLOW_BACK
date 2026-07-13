import { Injectable } from "@nestjs/common";
import { UserData } from "../interfaces/data/user-data";
import { PrismaService } from "@/database/prisma/prisma.service";

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getUser(email: string): Promise<UserData | null> {
    return await this.prisma.user.findUnique({
      where: { email },
      include: {
        business_unit: true,
        user_data: true,
        user_session: true,
      },
    });
  }
}
