import { PrismaService } from "@/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { CostCenter } from "@prisma/client";

@Injectable()
export class CostCenterRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: number) {
    return this.prisma.costCenter.findUnique({
      where: { id },
    });
  }

  async findAll() {
    return this.prisma.costCenter.findMany();
  }

  async create(costCenterInfo: Omit<CostCenter, "id">) {
    return this.prisma.costCenter.create({
      data: costCenterInfo,
    });
  }
}
