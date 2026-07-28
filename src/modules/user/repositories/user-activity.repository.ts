import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/database/prisma/prisma.service";
import { LocalStorageContextService } from "@/common/context/local-storage-context.service";

// import { LocalStorageContextData } from "@/common/context/interfaces/local-storage-context.data";
import { UserActivityRecord } from "../types/record/find-user-activities-by-email.record";

@Injectable()
export class UserActivityRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly requestContext: LocalStorageContextService,
  ) {}

  async findUserActivities(
    user_id: number,
  ): Promise<UserActivityRecord[] | null> {
    return await this.prisma.userActivity.findMany({
      where: { user_id },
      include: {
        department: true,
        sector: true,
        activity: true,
      },
    });
  }
}
