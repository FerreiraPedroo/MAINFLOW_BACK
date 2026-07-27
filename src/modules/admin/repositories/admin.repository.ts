import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/database/prisma/prisma.service";
import { LocalStorageContextService } from "@/common/context/local-storage-context.service";
import { LocalStorageContextData } from "@/common/context/interfaces/local-storage-context.data";

import { BusinessUnit, Department, Prisma } from "@prisma/client";
import { BusinessActivity } from "../data/business-activity.interface";
import { UpdateBusinessData } from "../types/data/update-business-unit.data";

import { DepartmentData } from "../data/department-data.interface";
import { CreateDepartmentData } from "../data/create-department.data";

import { CreateSectorData } from "../data/create-sector.data";

@Injectable()
export class AdminRepository {
  constructor(
    private prisma: PrismaService,
    private requestContext: LocalStorageContextService,
  ) {}

  // BUSINESS
  async findBusiness(): Promise<BusinessUnit[]> {
    return await this.prisma.businessUnit.findMany();
  }
  async getBusinessById(businessId: number): Promise<BusinessUnit | null> {
    return await this.prisma.businessUnit.findUnique({
      where: { id: Number(businessId) },
    });
  }
  async updateBusiness(
    businessId: number,
    businessData: UpdateBusinessData,
  ): Promise<BusinessUnit | null> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.prisma.businessUnit.update({
      where: { id: Number(businessId) },
      data: {
        ...businessData,
        updated_by: Number(requestContext.user_id),
      },
    });
  }
  async findBusinessActivities(
    businessId: number,
  ): Promise<BusinessActivity[]> {
    return await this.prisma.businessUnitActivity.findMany({
      where: { business_unit_id: Number(businessId) },
      include: {
        department: true,
        sector: true,
        activity: true,
      },
    });
  }
  async addProcessToBusiness(
    businessId: number,
    activities: {
      departmentId: number;
      sectorId: number | null;
      activityId: number;
    }[],
  ) {
    const queryValues = activities.map(
      (pi) =>
        Prisma.sql`(${businessId}, ${pi.departmentId}, ${pi.sectorId}, ${pi.activityId})`,
    );

    return await this.prisma.$queryRaw`
      INSERT INTO "BusinessUnitActivity" 
      ("business_unit_id", "department_id", "sector_id", "activity_id")
      VALUES ${Prisma.join(queryValues)}
    `;
  }
  async removeProcessToBusiness(
    businessId: number,
    businessProcessIds: number[],
  ) {
    return await this.prisma.businessUnitActivity.deleteMany({
      where: {
        AND: [
          { business_unit_id: businessId },
          { id: { in: businessProcessIds } },
        ],
      },
    });
  }

  // DEPARTMENTS
  async findDepartments(): Promise<DepartmentData[]> {
    return await this.prisma.department.findMany({
      include: {
        sectors: true,
        activities: true,
      },
    });
  }
  async createDepartment(data: CreateDepartmentData): Promise<Department> {
    return await this.prisma.department.create({
      data: {
        title: data.title,
        url: data.url,
        icon: data.icon,
      },
    });
  }

  // SECTOR
  async createSector(data: CreateSectorData) {
    return await this.prisma.sector.create({
      data: {
        ...data,
      },
    });
  }
}
