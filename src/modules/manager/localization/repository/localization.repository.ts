import { Injectable } from "@nestjs/common";

import { LocalStorageContextData } from "@/common/context/interfaces/local-storage-context.data";
import { LocalStorageContextService } from "@/common/context/local-storage-context.service";

import { PrismaService } from "@database/prisma/prisma.service";

import { CreateLocalizationData } from "../types/data/create-localization.data";
import { LocalizationRecord } from "../types/record/localization.record";
import { UpdateLocalizationData } from "../types/data/update-localization.data";

@Injectable()
export class LocalizationRepository {
  constructor(
    private prisma: PrismaService,
    private requestContext: LocalStorageContextService,
  ) {}

  async findLocalizations(): Promise<LocalizationRecord[]> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.prisma.localization.findMany({
      where: { business_unit_id: Number(requestContext.businessUnitId) },
      select: {
        id: true,
        title: true,
        status: true,
        block: {
          select: { title: true },
        },
        floor: {
          select: { title: true },
        },
        space_type: { select: { title: true } },
        address: { select: { short_address: true } },
      },
    });
  }

  async createLocalization(
    localizationData: CreateLocalizationData,
  ): Promise<LocalizationRecord> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.prisma.localization.create({
      data: {
        ...localizationData,
        business_unit_id: Number(requestContext.businessUnitId),
        created_by: Number(requestContext.userId),
      },
      select: {
        id: true,
        title: true,
        status: true,
        block: {
          select: { title: true },
        },
        floor: {
          select: { title: true },
        },
        space_type: { select: { title: true } },
        address: { select: { short_address: true } },
      },
    });
  }

  async updateLocalization(
    localizationId: number,
    localizationData: UpdateLocalizationData,
  ): Promise<LocalizationRecord> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.prisma.localization.update({
      where: {
        id: Number(localizationId),
        business_unit_id: Number(requestContext.businessUnitId),
      },
      data: {
        ...localizationData,
        updated_by: Number(requestContext.userId),
      },
      select: {
        id: true,
        title: true,
        status: true,
        block: {
          select: { title: true },
        },
        floor: {
          select: { title: true },
        },
        space_type: { select: { title: true } },
        address: { select: { short_address: true } },
      },
    });
  }
}
