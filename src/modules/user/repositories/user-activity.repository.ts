import { Injectable } from "@nestjs/common";

import { LocalStorageContextService } from "@/common/context/local-storage-context.service";

// import { LocalStorageContextData } from "@/common/context/interfaces/local-storage-context.data";
import { UserActivityRecord } from "../../contracts";
import { DatabaseService } from "@/common/infrastructure/database/prisma/database.service";

@Injectable()
export class UserActivityRepository {
  constructor(
    private readonly db: DatabaseService,
    private readonly requestContext: LocalStorageContextService,
  ) {}

  async findUserActivities(
    user_id: number,
  ): Promise<UserActivityRecord[] | null> {
    return await this.db.client.userActivity.findMany({
      where: { user_id },
      include: {
        department: true,
        sector: true,
        activity: true,
      },
    });
  }
}
