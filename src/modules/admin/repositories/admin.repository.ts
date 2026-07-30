import { Injectable } from "@nestjs/common";
import { BusinessUnit, BusinessUnitActivity, Department } from "@prisma/client";

import { PrismaService } from "@/common/infrastructure/database/prisma/prisma.service";
import { LocalStorageContextService } from "@/common/context/local-storage-context.service";
import { LocalStorageContextData } from "@/common/context/interfaces/local-storage-context.data";

import {
  AddActivityToBusinessInput,
  CreateDepartmentInput,
  CreateSectorInput,
  DepartmentRecord,
  FindBusinessActivitiesRecord,
  UpdateBusinessInput,
} from "../types";

@Injectable()
export class AdminRepository {
  constructor(
    private prisma: PrismaService,
    private requestContext: LocalStorageContextService,
  ) {}

  ///////////////////////////////////////////////////////////////////////
  // BUSINESS
  ///////////////////////////////////////////////////////////////////////
  async findBusiness(): Promise<BusinessUnit[]> {
    return await this.prisma.businessUnit.findMany();
  }
  async getBusinessById(business_id: number): Promise<BusinessUnit | null> {
    return await this.prisma.businessUnit.findUnique({
      where: { id: business_id },
    });
  }
  async updateBusiness(
    business_id: number,
    businessInput: UpdateBusinessInput,
  ): Promise<BusinessUnit | null> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.prisma.businessUnit.update({
      where: { id: business_id },
      data: {
        ...businessInput,
        updated_by: requestContext.user_id,
      },
    });
  }
  async findBusinessActivities(
    business_id: number,
  ): Promise<FindBusinessActivitiesRecord[]> {
    return await this.prisma.businessUnitActivity.findMany({
      where: { business_unit_id: business_id },
      include: {
        department: true,
        sector: true,
        activity: true,
      },
    });
  }
  async addActivityToBusiness(
    business_id: number,
    activity_id: number,
    businessActivity: AddActivityToBusinessInput,
  ): Promise<BusinessUnitActivity> {
    return await this.prisma.businessUnitActivity.create({
      data: {
        business_unit_id: business_id,
        activity_id,
        ...businessActivity,
      },
    });
  }
  async removeActivityFromBusiness(business_id: number, activity_id: number) {
    return await this.prisma.businessUnitActivity.delete({
      where: {
        id: activity_id,
        business_unit_id: business_id,
      },
    });
  }

  ///////////////////////////////////////////////////////////////////////
  // DEPARTMENT
  ///////////////////////////////////////////////////////////////////////
  async findDepartments(): Promise<DepartmentRecord[]> {
    return await this.prisma.department.findMany({
      include: {
        sectors: true,
        activities: true,
      },
    });
  }
  async createDepartment(
    departmentInput: CreateDepartmentInput,
  ): Promise<Department> {
    return await this.prisma.department.create({
      data: { ...departmentInput },
    });
  }

  ///////////////////////////////////////////////////////////////////////
  // SECTOR
  ///////////////////////////////////////////////////////////////////////
  async createSector(sectorInput: CreateSectorInput) {
    return await this.prisma.sector.create({
      data: { ...sectorInput },
    });
  }
}
