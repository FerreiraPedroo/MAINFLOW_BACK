import { Injectable } from "@nestjs/common";

import { DatabaseService } from "@/common/infrastructure/database/prisma/database.service";
import {
  LocalStorageContextData,
  LocalStorageContextService,
} from "@/common/context";

import { FindMaintenanceRecord, MaintenanceData } from "../types";

@Injectable()
export class MaintenanceRepository {
  constructor(
    private readonly db: DatabaseService,
    private readonly requestContext: LocalStorageContextService,
  ) {}

  async getMaintenance(maintenanceId: number) {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return this.db.client.maintenance.findUnique({
      where: {
        id: maintenanceId,
        business_unit_id: requestContext.business_unit_id,
      },
    });
  }
  async findMaintenance(
    startDate: Date,
    endDate: Date,
  ): Promise<FindMaintenanceRecord[]> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.maintenance.findMany({
      where: {
        AND: [
          { open_date: { gte: startDate } },
          { open_date: { lte: endDate } },
          { business_unit_id: requestContext.business_unit_id },
        ],
      },
      include: {
        localization: {
          include: {
            block: true,
            floor: true,
            space_type: true,
            building: true,
          },
        },
      },
    });
  }
  async createMaintenance(maintenanceData: MaintenanceData) {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.maintenance.create({
      data: {
        ...maintenanceData,
        business_unit_id: requestContext.business_unit_id,
        user_id: requestContext.user_id,
      },
    });
  }
  async openMaintenance(maintenanceId: number, openDate: string) {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.maintenance.update({
      where: {
        id: maintenanceId,
        business_unit_id: requestContext.business_unit_id,
      },
      data: {
        open_date: openDate,
      },
    });
  }
}
