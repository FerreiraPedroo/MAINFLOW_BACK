import { Injectable } from "@nestjs/common";
import { CostCenter } from "@prisma/client";

import { PrismaService } from "@/database/prisma/prisma.service";

import { CreateCostCenterData } from "../types/data/create-cost-center.data";
import { LocalStorageContextService } from "@/common/context/local-storage-context.service";
import { LocalStorageContextData } from "@/common/context/interfaces/local-storage-context.data";

@Injectable()
export class CostCenterRepository {
  constructor(
    private prisma: PrismaService,
    private requestContext: LocalStorageContextService,
  ) {}

  async findById(id: number) {
    return this.prisma.costCenter.findUnique({
      where: { id },
    });
  }
  async findAll() {
    return this.prisma.costCenter.findMany();
  }
  async create(costCenterData: CreateCostCenterData): Promise<CostCenter> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return this.prisma.costCenter.create({
      data: {
        ...costCenterData,
        business_unit_id: Number(requestContext.business_unit_id),
        created_by: Number(requestContext.user_id),
      },
    });
  }
}
