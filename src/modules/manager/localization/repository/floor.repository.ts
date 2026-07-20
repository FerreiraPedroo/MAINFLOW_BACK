import { Injectable } from "@nestjs/common";

import { LocalStorageContextData } from "@/common/context/interfaces/local-storage-context.data";
import { LocalStorageContextService } from "@/common/context/local-storage-context.service";

import { PrismaService } from "@database/prisma/prisma.service";

import { Floor } from "@prisma/client";
import { CreateFloorData } from "../types/data/create-floor.data";

@Injectable()
export class FloorRepository {
  constructor(
    private prisma: PrismaService,
    private requestContext: LocalStorageContextService,
  ) {}

  async findFloor(): Promise<Floor[]> {
    const userData = this.requestContext.getStore() as LocalStorageContextData;

    return await this.prisma.floor.findMany({
      where: { business_unit_id: Number(userData.businessUnitId) },
    });
  }
  async createFloor(floorData: CreateFloorData): Promise<Floor> {
    const userData = this.requestContext.getStore() as LocalStorageContextData;

    return await this.prisma.floor.create({
      data: {
        title: floorData.title,
        status: floorData.status.toUpperCase(),
        business_unit_id: Number(userData.businessUnitId),
        created_by: Number(userData.userId),
      },
    });
  }
  async updateFloor(floorId: number, floorStatus: string): Promise<Floor> {
    const userData = this.requestContext.getStore() as LocalStorageContextData;

    return await this.prisma.floor.update({
      where: {
        id: Number(floorId),
        business_unit_id: Number(userData.businessUnitId),
      },
      data: {
        status: floorStatus.toUpperCase(),
        updated_by: Number(userData.userId),
      },
    });
  }
}
