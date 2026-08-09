import { Injectable } from "@nestjs/common";
import { BusinessUnit, BusinessUnitActivity, Department } from "@prisma/client";

import { DatabaseService } from "@/common/infrastructure/database/prisma/database.service";

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
    private readonly db: DatabaseService,
    private readonly requestContext: LocalStorageContextService,
  ) {}

  ///////////////////////////////////////////////////////////////////////
  // BUSINESS
  ///////////////////////////////////////////////////////////////////////
  async findBusiness(): Promise<BusinessUnit[]> {
    return await this.db.client.businessUnit.findMany();
  }
  async getBusinessById(business_id: number): Promise<BusinessUnit | null> {
    return await this.db.client.businessUnit.findUnique({
      where: { id: business_id },
    });
  }
  async updateBusiness(
    business_id: number,
    businessInput: UpdateBusinessInput,
  ): Promise<BusinessUnit | null> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.businessUnit.update({
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
    return await this.db.client.businessUnitActivity.findMany({
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
    return await this.db.client.businessUnitActivity.create({
      data: {
        business_unit_id: business_id,
        activity_id,
        ...businessActivity,
      },
    });
  }
  async removeActivityFromBusiness(business_id: number, activity_id: number) {
    return await this.db.client.businessUnitActivity.delete({
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
    return await this.db.client.department.findMany({
      include: {
        sectors: true,
        activities: true,
      },
    });
  }
  async createDepartment(
    departmentInput: CreateDepartmentInput,
  ): Promise<Department> {
    return await this.db.client.department.create({
      data: { ...departmentInput },
    });
  }

  ///////////////////////////////////////////////////////////////////////
  // SECTOR
  ///////////////////////////////////////////////////////////////////////
  async createSector(sectorInput: CreateSectorInput) {
    return await this.db.client.sector.create({
      data: { ...sectorInput },
    });
  }
}
