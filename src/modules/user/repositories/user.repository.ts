import { Injectable } from "@nestjs/common";
import { UserComplete } from "../interfaces/user-complete.interface";
import { PrismaService } from "@/database/prisma/prisma.service";

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getUser(email: string): Promise<UserComplete | null> {
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
