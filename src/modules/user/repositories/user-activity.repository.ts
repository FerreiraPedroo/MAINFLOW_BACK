import { PrismaService } from "@/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

import { UserActivityRecord } from "../types/record/find-user-activities-by-email.record";
import { LocalStorageContextService } from "@/common/context/local-storage-context.service";
import { LocalStorageContextData } from "@/common/context/interfaces/local-storage-context.data";

@Injectable()
export class UserActivityRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly requestContext: LocalStorageContextService,
  ) {}

  async findUserActivities(
    user_id: number,
  ): Promise<UserActivityRecord[] | null> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.prisma.userActivity.findMany({
      where: {
        user_id: user_id,
        business_unit_id: requestContext.business_unit_id,
      },
      include: {
        department: true,
        sector: true,
        activity: true,
      },
    });
  }
}
