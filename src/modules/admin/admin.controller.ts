import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";

import { ValidateService } from "@/common/decorators/validate-service.decorator";

import { AdminService } from "./admin.service";

import type {
  AddActivityToBusinessInputDto,
  CreateDepartmentInputDto,
  CreateSectorInputDto,
  UpdateBusinessInputDto,
} from "./types";
import {
  AddActivityToBusinessInputSchema,
  AddActivityToBusinessOutputSchema,
  CreateDepartmentInputSchema,
  CreateDepartmentOutputSchema,
  CreateSectorInputSchema,
  CreateSectorOutputSchema,
  FindBusinessOutputSchema,
  FindDepartmentsOutputSchema,
  GetBusinessActivitiesInputSchema,
  GetBusinessActivitiesOutputSchema,
  GetBusinessInputSchema,
  GetBusinessOutputSchema,
  RemoveBusinessActivityInputSchema,
  RemoveBusinessActivityOutputSchema,
  UpdateBusinessInputSchema,
  UpdateBusinessOutputSchema,
} from "./types";

@Controller("admin")
export class AdminController {
  constructor(private adminService: AdminService) {}

  ///////////////////////////////////////////////////////////////////////
  // BUSINESS
  ///////////////////////////////////////////////////////////////////////
  @Get("businesses")
  @ValidateService({ output: FindBusinessOutputSchema })
  async findBusiness() {
    return await this.adminService.findBusiness();
  }

  @Get("businesses/:business_id")
  @ValidateService({
    input: GetBusinessInputSchema,
    output: GetBusinessOutputSchema,
  })
  async getBusinessById(@Param("business_id") business_id: number) {
    return await this.adminService.getBusinessById(business_id);
  }

  @Put("businesses/:business_id")
  @ValidateService({
    input: UpdateBusinessInputSchema,
    output: UpdateBusinessOutputSchema,
  })
  async updateBusiness(
    @Param("business_id") business_id: number,
    @Body() request: UpdateBusinessInputDto,
  ) {
    return await this.adminService.updateBusiness(business_id, request);
  }

  @Get("businesses/:business_id/activities")
  @ValidateService({
    input: GetBusinessActivitiesInputSchema,
    output: GetBusinessActivitiesOutputSchema,
  })
  async findBusinessActivities(@Param("business_id") business_id: number) {
    return await this.adminService.findBusinessActivities(business_id);
  }

  @Post("businesses/:business_id/activities/:activity_id")
  @ValidateService({
    input: AddActivityToBusinessInputSchema,
    output: AddActivityToBusinessOutputSchema,
  })
  async addActivityToBusiness(
    @Param("business_id") business_id: number,
    @Param("activity_id") activity_id: number,
    @Body() request: AddActivityToBusinessInputDto,
  ) {
    return await this.adminService.addActivityToBusiness(
      business_id,
      activity_id,
      request,
    );
  }

  @Delete("businesses/:business_id/activities/:activity_id")
  @ValidateService({
    input: RemoveBusinessActivityInputSchema,
    output: RemoveBusinessActivityOutputSchema,
  })
  async removeActivitFromBusiness(
    @Param("business_id") business_id: number,
    @Param("activity_id") activity_id: number,
  ) {
    return await this.adminService.removeActivitFromBusiness(
      business_id,
      activity_id,
    );
  }

  ///////////////////////////////////////////////////////////////////////
  // DEPARTMENT
  ///////////////////////////////////////////////////////////////////////
  @Get("departments")
  @ValidateService({ output: FindDepartmentsOutputSchema })
  async findDepartments() {
    return await this.adminService.findDepartments();
  }
  @Post("departments")
  @ValidateService({
    input: CreateDepartmentInputSchema,
    output: CreateDepartmentOutputSchema,
  })
  async createDepartment(@Body() request: CreateDepartmentInputDto) {
    return await this.adminService.createDepartment(request);
  }

  ///////////////////////////////////////////////////////////////////////
  // SECTOR
  ///////////////////////////////////////////////////////////////////////
  @Post("sectors")
  @ValidateService({
    input: CreateSectorInputSchema,
    output: CreateSectorOutputSchema,
  })
  async createSector(@Body() request: CreateSectorInputDto) {
    return await this.adminService.createSector(request);
  }
}
