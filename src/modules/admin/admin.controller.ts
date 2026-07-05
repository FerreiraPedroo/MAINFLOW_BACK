import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { AdminService } from "./admin.service";
import type { AddDepartmentToBusinessRequest } from "./dto/add-department-to-business.dto";
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
  @Get("business-units/:businessId/department")
  async findBusinessDepartments(@Param("businessId") businessId: number) {
    return await this.adminService.findBusinessDepartments(businessId);
  }

  @Post("business-units/:businessId/department")
  async addDepartmentToBusiness(
    @Body() request: AddDepartmentToBusinessRequest,
  ) {
    return await this.adminService.addDepartmentToBusiness(request);
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
