import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { AdminService } from "./admin.service";
import type { CreateDepartmentRequest } from "./dto/create-department.request.dto";
import type { AddProcessToBusinessRequest } from "./dto/add-process-to-business.dto";
import type { RemoveProcessToBusinessRequest } from "./dto/remove-process-to-business.request.dto";
import type { CreateSectorRequest } from "./dto/create-sector.request";

@Controller("admin")
export class AdminController {
  constructor(private adminService: AdminService) {}
  //
  // BUSINESS
  @Get("business-units/:businessId")
  async getBusinessById(@Param("businessId") businessId: number) {
    return await this.adminService.getBusinessById(businessId);
  }
  @Get("business-units/:businessId/process")
  async findBusinessProcess(@Param("businessId") businessId: number) {
    return await this.adminService.findBusinessProcess(businessId);
  }
  @Post("business-units/:businessId/process")
  async addProcessToBusiness(@Body() request: AddProcessToBusinessRequest) {
    return await this.adminService.addProcessToBusiness(request);
  }
  @Delete("business-units/:businessId/process")
  async removeProcessToBusiness(
    @Body() request: RemoveProcessToBusinessRequest,
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
  async createSector(@Body() request: CreateSectorRequest ){
    return await this.adminService.createSector(request)
  }
}
