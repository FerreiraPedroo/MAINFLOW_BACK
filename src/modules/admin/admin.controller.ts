import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { AdminService } from "./admin.service";
import type { CreateDepartmentRequest } from "./dto/create-department.request.dto";
import type { AddProcessToBusinessRequest } from "./dto/add-process-to-business.dto";
import type { RemoveActivityToBusinessRequest } from "./dto/remove-activity-to-business.request.dto";
import type { CreateSectorRequest } from "./dto/create-sector.request";
import type { UpdateBusinessRequest } from "./types/dto/update-business-unit-request.dto";

@Controller("admin")
export class AdminController {
  constructor(private adminService: AdminService) {}
  //
  // BUSINESS
  @Get("business-units")
  async findBusiness() {
    return await this.adminService.findBusiness();
  }
  @Get("business-units/:businessId")
  async getBusinessById(@Param("businessId") businessId: number) {
    return await this.adminService.getBusinessById(businessId);
  }
  @Put("business-units/:businessId")
  async updateBusiness(
    @Param("businessId") businessId: number,
    @Body() request: UpdateBusinessRequest,
  ) {
    return await this.adminService.updateBusiness(businessId, request);
  }

  @Get("business-units/:businessId/processes")
  async findBusinessProcess(@Param("businessId") businessId: number) {
    return await this.adminService.findBusinessProcess(businessId);
  }

  @Post("business-units/:businessId/processes")
  async addProcessToBusiness(@Body() request: AddProcessToBusinessRequest) {
    return await this.adminService.addProcessToBusiness(request);
  }

  @Delete("business-units/:businessId/processes")
  async removeProcessToBusiness(
    @Body() request: RemoveActivityToBusinessRequest,
  ) {
    return await this.adminService.removeProcessToBusiness(request);
  }

  //
  // DEPARTMENT
  @Get("departments")
  async findDepartments() {
    return await this.adminService.findDepartments();
  }
  @Post("departments")
  async createDepartment(@Body() request: CreateDepartmentRequest) {
    return await this.adminService.createDepartment(request);
  }

  //
  // SECTOR
  @Post("sector")
  async createSector(@Body() request: CreateSectorRequest) {
    return await this.adminService.createSector(request);
  }
}
