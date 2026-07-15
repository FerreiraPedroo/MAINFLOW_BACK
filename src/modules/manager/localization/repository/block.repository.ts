import { Injectable } from "@nestjs/common";

import { LocaStorageContextData } from "@/common/context/interfaces/local-storage-context.data";
import { LocalStorageContextService } from "@/common/context/local-storage-context.service";

import { PrismaService } from "@database/prisma/prisma.service";

import { Block } from "@prisma/client";
import { CreateBlockData } from "../types/data/create-block.data";

@Injectable()
export class BlockRepository {
  constructor(
    private prisma: PrismaService,
    private requestContext: LocalStorageContextService,
  ) {}

  async findBlocks(): Promise<Block[]> {
    const userData = this.requestContext.getStore() as LocaStorageContextData;

    return await this.prisma.block.findMany({
      where: { business_unit_id: Number(userData.businessUnitId) },
    });
  }
  async createBlock(blockData: CreateBlockData): Promise<Block> {
    const userData = this.requestContext.getStore() as LocaStorageContextData;

    return await this.prisma.block.create({
      data: {
        title: blockData.title,
        status: blockData.status.toUpperCase(),
        business_unit_id: Number(userData.businessUnitId),
        created_by: Number(userData.userId),
      },
    });
  }
  async updateBlock(blockId: number, blockStatus: string): Promise<Block> {
    const userData = this.requestContext.getStore() as LocaStorageContextData;

    return await this.prisma.block.update({
      where: {
        id: Number(blockId),
        business_unit_id: Number(userData.businessUnitId),
      },
      data: {
        status: blockStatus.toUpperCase(),
        updated_by: Number(userData.userId),
      },
    });
  }
}
