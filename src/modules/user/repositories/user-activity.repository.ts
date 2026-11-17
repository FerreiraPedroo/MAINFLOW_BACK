import { Injectable } from "@nestjs/common";

import { LocalStorageContextData } from "@/common/context";
import { LocalStorageContextService } from "@/common/context/local-storage-context.service";
import { DatabaseService } from "@/common/infrastructure/database/prisma/database.service";

import { UserActivityRecord } from "../types";

@Injectable()
export class UserActivityRepository {
  constructor(
    private readonly db: DatabaseService,
    private readonly requestContext: LocalStorageContextService,
  ) {}

  async findUserActivities(
    user_id: number,
  ): Promise<UserActivityRecord[] | null> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.userActivity.findMany({
      where: { user_id, business_unit_id: requestContext.business_unit_id },
      include: {
        department: true,
        sector: true,
        activity: true,
      },
    });
  }
}
