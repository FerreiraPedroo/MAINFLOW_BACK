import { Injectable } from "@nestjs/common";

import { LocalStorageContextData } from "@/common/context/interfaces/local-storage-context.data";
import { LocalStorageContextService } from "@/common/context/local-storage-context.service";

import { DatabaseService } from "@/common/infrastructure/database/prisma/database.service";

import { CreateLocalizationData } from "../types/data/create-localization.data";
import { LocalizationRecord } from "../types/record/localization.record";
import { UpdateLocalizationData } from "../types/data/update-localization.data";

@Injectable()
export class LocalizationRepository {
  constructor(
    private db: DatabaseService,
    private requestContext: LocalStorageContextService,
  ) {}

  async findLocalizations(): Promise<LocalizationRecord[]> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.localization.findMany({
      where: { business_unit_id: Number(requestContext.business_unit_id) },
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

    return await this.db.client.localization.create({
      data: {
        ...localizationData,
        business_unit_id: Number(requestContext.business_unit_id),
        created_by: Number(requestContext.user_id),
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

    return await this.db.client.localization.update({
      where: {
        id: Number(localizationId),
        business_unit_id: Number(requestContext.business_unit_id),
      },
      data: {
        ...localizationData,
        updated_by: Number(requestContext.user_id),
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
