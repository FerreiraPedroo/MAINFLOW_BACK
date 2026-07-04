import { PrismaService } from "@/database/prisma/prisma.service";
import { DepartmentSectorComplete } from "@/modules/manager/department/types/department-sector.type";
import { Injectable } from "@nestjs/common";
import { BusinessUnit } from "@prisma/client";

@Injectable()
export class AdminRepository {
  constructor(private prisma: PrismaService) {}

  async getBusinessById(businessId: number): Promise<BusinessUnit | null> {
    return await this.prisma.businessUnit.findUnique({
      where: { id: Number(businessId) },
    });
  }
  async findBusinessDepartmentSectors(
    businessId: number,
  ): Promise<DepartmentSectorComplete[] | null> {
    return await this.prisma.departmentSector.findMany({
      where: { business_unit_id: { equals: Number(businessId) } },
      include: { department: true, sector: true, process_item: true },
    });
  }
  async findBusinessDepartments(businessId: number) {
    return await this.prisma.businessUnitData.findMany({
      select: { business_unit_id: businessId },
    });
  }
}
