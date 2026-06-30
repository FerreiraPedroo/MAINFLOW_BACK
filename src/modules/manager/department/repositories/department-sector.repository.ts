import { PrismaService } from "@/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { DepartmentSectorComplete } from "../types/department-sector.type";

@Injectable()
export class DepartmentSectorRepository {
  constructor(private prismaService: PrismaService) {}

  async findDepartmetSectorByUserId(
    userId: number,
    businessUnitId: number,
  ): Promise<DepartmentSectorComplete[] | null> {
    return await this.prismaService.departmentSector.findMany({
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
