import { Injectable } from "@nestjs/common";

import { LocalStorageContextData } from "@/common/context/interfaces/local-storage-context.data";
import { LocalStorageContextService } from "@/common/context/local-storage-context.service";

import { DatabaseService } from "@/common/infrastructure/database/prisma/database.service";

import { Floor } from "@prisma/client";
import { CreateFloorData } from "../types/data/create-floor.data";

@Injectable()
export class FloorRepository {
  constructor(
    private db: DatabaseService,
    private requestContext: LocalStorageContextService,
  ) {}

  async findFloor(): Promise<Floor[]> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.floor.findMany({
      where: { business_unit_id: Number(requestContext.business_unit_id) },
    });
  }
  async createFloor(floorData: CreateFloorData): Promise<Floor> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.floor.create({
      data: {
        title: floorData.title,
        status: floorData.status.toUpperCase(),
        business_unit_id: Number(requestContext.business_unit_id),
        created_by: Number(requestContext.user_id),
      },
    });
  }
  async updateFloor(floorId: number, floorStatus: string): Promise<Floor> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.floor.update({
      where: {
        id: Number(floorId),
        business_unit_id: Number(requestContext.business_unit_id),
      },
      data: {
        status: floorStatus.toUpperCase(),
        updated_by: Number(requestContext.user_id),
      },
    });
  }
}
