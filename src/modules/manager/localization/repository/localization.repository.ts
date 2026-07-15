import { Injectable } from "@nestjs/common";

import { LocaStorageContextData } from "@/common/context/interfaces/local-storage-context.data";
import { LocalStorageContextService } from "@/common/context/local-storage-context.service";

import { PrismaService } from "@database/prisma/prisma.service";

import { Localization } from "@prisma/client";
import { CreateLocalizationData } from "../types/data/create-localization.data";
import { LocalizationRecord } from "../types/record/localization.record";

@Injectable()
export class LocalizationRepository {
  constructor(
    private prisma: PrismaService,
    private requestContext: LocalStorageContextService,
  ) {}

  async findLocalizations(): Promise<LocalizationRecord[]> {
    const userData = this.requestContext.getStore() as LocaStorageContextData;

    return await this.prisma.localization.findMany({
      where: { business_unit_id: Number(userData.businessUnitId) },
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
    const userData = this.requestContext.getStore() as LocaStorageContextData;

    return await this.prisma.localization.create({
      data: {
        ...localizationData,
        business_unit_id: Number(userData.businessUnitId),
        created_by: Number(userData.userId),
      },
      select: {
        id: true,
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
  ): Promise<Localization> {
    const userData = this.requestContext.getStore() as LocaStorageContextData;

    return await this.prisma.localization.update({
      where: {
        id: Number(localizationId),
        business_unit_id: Number(userData.businessUnitId),
      },
      data: {
        ...localizationData,
        updated_by: Number(userData.userId),
      },
    });
  }
}
