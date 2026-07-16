import { PrismaService } from "@/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { UserActivityData } from "../types/data/user-activity.data";
// import { UserActivityData } from "../interfaces/data/user-activity.data";

@Injectable()
export class UserDataRepository {
  constructor(private prisma: PrismaService) {}

  async getUserData(userId: number) {
    return await this.prisma.userData.findFirst({
      where: { user_id: userId },
    });
  }
  async findUserActivitiesByUserId(
    userId: number,
    businessUnitId: number,
  ): Promise<UserActivityData[] | null> {
    return await this.prisma.userActivity.findMany({
      where: {
        user_data_id: userId,
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
