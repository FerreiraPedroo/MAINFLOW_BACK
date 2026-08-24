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

  async findMaintenance(
    startDate: Date,
    endDate: Date,
  ): Promise<FindMaintenanceRecord[]> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return this.db.client.maintenance.findMany({
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
            address: true,
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
}
