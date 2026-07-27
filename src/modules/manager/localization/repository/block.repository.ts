import { Injectable } from "@nestjs/common";

import { LocalStorageContextData } from "@/common/context/interfaces/local-storage-context.data";
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
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.prisma.block.findMany({
      where: { business_unit_id: Number(requestContext.business_unit_id) },
    });
  }
  async createBlock(blockData: CreateBlockData): Promise<Block> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.prisma.block.create({
      data: {
        title: blockData.title,
        status: blockData.status.toUpperCase(),
        business_unit_id: Number(requestContext.business_unit_id),
        created_by: Number(requestContext.userId),
      },
    });
  }
  async updateBlock(blockId: number, blockStatus: string): Promise<Block> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.prisma.block.update({
      where: {
        id: Number(blockId),
        business_unit_id: Number(requestContext.business_unit_id),
      },
      data: {
        status: blockStatus.toUpperCase(),
        updated_by: Number(requestContext.userId),
      },
    });
  }
}
