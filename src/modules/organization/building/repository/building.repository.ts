import { Injectable } from "@nestjs/common";

import { LocalStorageContextData } from "@/common/context/interfaces/local-storage-context.data";
import { LocalStorageContextService } from "@/common/context/local-storage-context.service";

import { DatabaseService } from "@/common/infrastructure/database/prisma/database.service";

import { CreateBuildingData } from "../types/data/create-building.data";
import { UpdateBuildingData } from "../types/data/update-building.data";
import { Building } from "@prisma/client";
import { GetBuildingRecord } from "../types/record/get-building.record";

@Injectable()
export class BuildingRepository {
  constructor(
    private db: DatabaseService,
    private requestContext: LocalStorageContextService,
  ) {}

  async findBuilding(): Promise<Building[]> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.building.findMany({
      where: { business_unit_id: requestContext.business_unit_id },
    });
  }

  async getBuilding(buildingId: number): Promise<GetBuildingRecord | null> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.building.findFirst({
      where: {
        id: buildingId,
        business_unit_id: requestContext.business_unit_id,
      },
      include: {
        _count: {
          select: { localizations: true, building_lease_contracts: true },
        },
      },
    });
  }

  async createBuilding(buildingData: CreateBuildingData): Promise<Building> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.building.create({
      data: {
        ...buildingData,
        business_unit_id: Number(requestContext.business_unit_id),
      },
    });
  }

  async updateBuilding(
    buildingId: number,
    buildingData: UpdateBuildingData,
  ): Promise<Building> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.building.update({
      where: {
        id: Number(buildingId),
        business_unit_id: Number(requestContext.business_unit_id),
      },
      data: {
        ...buildingData,
        updated_by: Number(requestContext.user_id),
      },
    });
  }
}
