import { PrismaService } from "@/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

import { UserActivityRecord } from "../types/record/find-user-activities-by-email.record";

@Injectable()
export class UserActivityRepository {
  constructor(private prisma: PrismaService) {}

  async findUserActivitiesById(
    userId: number,
    businessUnitId: number,
  ): Promise<UserActivityRecord[] | null> {
    return await this.prisma.userActivity.findMany({
      where: {
        user_id: userId,
        business_unit_id: businessUnitId,
      },
      include: {
        department: true,
        sector: true,
        activity: true,
      },
    });
  }
}
