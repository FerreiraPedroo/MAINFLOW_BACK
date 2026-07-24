import { Injectable } from "@nestjs/common";

import { LocalStorageContextData } from "@/common/context/interfaces/local-storage-context.data";
import { LocalStorageContextService } from "@/common/context/local-storage-context.service";

import { PrismaService } from "@database/prisma/prisma.service";

import { SpaceType } from "@prisma/client";
import { CreateSpaceTypeData } from "../types/data/space-type-block.data";

@Injectable()
export class SpaceTypeRepository {
  constructor(
    private prisma: PrismaService,
    private requestContext: LocalStorageContextService,
  ) {}

  async findSpaceTypes(): Promise<SpaceType[]> {
    const userContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.prisma.spaceType.findMany({
      where: { business_unit_id: Number(userContext.businessUnitId) },
    });
  }
  async createSpaceType(
    spaceTypeData: CreateSpaceTypeData,
  ): Promise<SpaceType> {
    const userContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.prisma.spaceType.create({
      data: {
        title: spaceTypeData.title,
        status: spaceTypeData.status.toUpperCase(),
        business_unit_id: Number(userContext.businessUnitId),
        created_by: Number(userContext.userId),
      },
    });
  }
  async updateSpaceType(
    spaceTypeId: number,
    spaceTypeStatus: string,
  ): Promise<SpaceType> {
    const userContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.prisma.spaceType.update({
      where: {
        id: Number(spaceTypeId),
        business_unit_id: Number(userContext.businessUnitId),
      },
      data: {
        status: spaceTypeStatus.toUpperCase(),
        updated_by: Number(userContext.userId),
      },
    });
  }
}
