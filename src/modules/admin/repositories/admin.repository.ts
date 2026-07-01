import { PrismaService } from "@/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { BusinessUnit } from "@prisma/client";

@Injectable()
export class AdminRepository {
  constructor(private prisma: PrismaService) {}

  async findBusinessUnitById(id: number): Promise<BusinessUnit | null> {
    return await this.prisma.businessUnit.findUnique({ where: { id } });
  }
}
