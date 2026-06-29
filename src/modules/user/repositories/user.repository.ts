import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/database/prisma/prisma.service";
import { User } from "@prisma/client";

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async userLogin(user: string): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: { email: user },
    });
  }
}
