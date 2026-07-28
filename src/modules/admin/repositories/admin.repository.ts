import { Injectable } from "@nestjs/common";
import { BusinessUnit, BusinessUnitActivity, Department } from "@prisma/client";

import { PrismaService } from "@/database/prisma/prisma.service";
import { LocalStorageContextService } from "@/common/context/local-storage-context.service";
import { LocalStorageContextData } from "@/common/context/interfaces/local-storage-context.data";

import { UpdateBusinessData } from "../types/data/update-business-unit.data";

import { DepartmentData } from "../data/department-data.interface";
import { CreateDepartmentData } from "../data/create-department.data";

import { CreateSectorData } from "../data/create-sector.data";
import {
  AddActivityToBusinessInput,
  FindBusinessActivitiesRecord,
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
    businessData: UpdateBusinessData,
  ): Promise<BusinessUnit | null> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.prisma.businessUnit.update({
      where: { id: business_id },
      data: {
        ...businessData,
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
