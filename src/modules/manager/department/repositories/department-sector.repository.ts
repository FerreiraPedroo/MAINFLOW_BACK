import { PrismaService } from "@/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { UserDepartmentSectorComplete } from "../types/department-sector.type";

@Injectable()
export class UserDepartmentSectorRepository {
  constructor(private prismaService: PrismaService) {}

  async findDepartmetSectorByUserId(
    userId: number,
    businessUnitId: number,
  ): Promise<UserDepartmentSectorComplete[] | null> {
    return await this.prismaService.userDepartmentSector.findMany({
      where: {
        user_data_id: userId,
        business_unit_id: businessUnitId,
      },
      include: {
        department: true,
        sector: true,
        process_item: true,
      },
    });
  }
}
