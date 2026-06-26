import { PrismaService } from "@/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CostCenterRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: number) {
    return this.prisma.costCenter.findUnique({
      where: { id },
    });
  }
}
