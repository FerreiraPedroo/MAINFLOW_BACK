import { Injectable } from "@nestjs/common";
import { FindCostCenterDto } from "./dto";
import { PrismaService } from "@/database/prisma/prisma.service";
import { CostCenter } from "@prisma/client";

@Injectable()
export class CostCenterService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: FindCostCenterDto): Promise<CostCenter[]> {
    try {
      const result = this.prisma.costCenter.findMany({
        where: { title: query.title },
      });
      return result;
    } catch (error: unknown) {
      return [];
    }
  }
}
