import { Injectable } from "@nestjs/common";

import { LocalStorageContextData } from "@/common/context/interfaces/local-storage-context.data";
import { LocalStorageContextService } from "@/common/context/local-storage-context.service";

import { DatabaseService } from "@/common/infrastructure/database/prisma/database.service";

import { Block } from "@prisma/client";
import { CreateBlockData } from "../types/data/create-block.data";

@Injectable()
export class BlockRepository {
  constructor(
    private db: DatabaseService,
    private requestContext: LocalStorageContextService,
  ) {}

  async findBlocks(): Promise<Block[]> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.block.findMany({
      where: { business_unit_id: Number(requestContext.business_unit_id) },
    });
  }
  async createBlock(blockData: CreateBlockData): Promise<Block> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.block.create({
      data: {
        title: blockData.title,
        status: blockData.status.toUpperCase(),
        business_unit_id: Number(requestContext.business_unit_id),
        created_by: Number(requestContext.user_id),
      },
    });
  }
  async updateBlock(blockId: number, blockStatus: string): Promise<Block> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.block.update({
      where: {
        id: Number(blockId),
        business_unit_id: Number(requestContext.business_unit_id),
      },
      data: {
        status: blockStatus.toUpperCase(),
        updated_by: Number(requestContext.user_id),
      },
    });
  }
}
