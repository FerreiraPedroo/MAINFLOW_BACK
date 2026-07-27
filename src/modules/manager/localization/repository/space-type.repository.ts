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
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.prisma.spaceType.findMany({
      where: { business_unit_id: Number(requestContext.business_unit_id) },
    });
  }
  async createSpaceType(
    spaceTypeData: CreateSpaceTypeData,
  ): Promise<SpaceType> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.prisma.spaceType.create({
      data: {
        title: spaceTypeData.title,
        status: spaceTypeData.status.toUpperCase(),
        business_unit_id: Number(requestContext.business_unit_id),
        created_by: Number(requestContext.user_id),
      },
    });
  }
  async updateSpaceType(
    spaceTypeId: number,
    spaceTypeStatus: string,
  ): Promise<SpaceType> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.prisma.spaceType.update({
      where: {
        id: Number(spaceTypeId),
        business_unit_id: Number(requestContext.business_unit_id),
      },
      data: {
        status: spaceTypeStatus.toUpperCase(),
        updated_by: Number(requestContext.user_id),
      },
    });
  }
}
