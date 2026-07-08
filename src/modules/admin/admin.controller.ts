import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { AdminService } from "./admin.service";
import type { AddProcessToBusinessRequest } from "./dto/add-process-to-business.dto";
import type { CreateDepartmentRequest } from "./dto/create-department.request.dto";

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
    return await this.adminService.findBusinessDepartments(businessId);
  }

  @Post("business-units/:businessId/departments")
  async addProcessToBusiness(@Body() request: AddProcessToBusinessRequest) {
    return await this.adminService.addProcessToBusiness(request);
  }

  @Delete("business-units/:businessId/departments")
  async removeProcessToBusiness(@Body() request: AddProcessToBusinessRequest) {
    return await this.adminService.removeProcessToBusiness(request);
  }

  //
  // DEPARTMENT
  @Get("departments")
  async findDepartments() {
    return await this.adminService.findDepartments();
  }
  @Post("departments")
  async createDepartment(@Body() body: CreateDepartmentRequest) {
    return await this.adminService.createDepartment(body);
  }
}
