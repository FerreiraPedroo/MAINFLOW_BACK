import { Controller, Get, Param } from "@nestjs/common";
import { AdminService } from "./admin.service";

@Controller("admin")
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get("business-unit/:businessId")
  async getBusinessById(@Param("businessId") businessId: number) {
    return await this.adminService.getBusinessById(businessId);
  }
  @Get("business-unit/:businessId/department-sectors")
  async findBusinessDepartmentSectors(@Param("businessId") businessId: number) {
    return await this.adminService.findBusinessDepartmentSectors(businessId);
  }
  @Get("business-unit/:businessId/department")
  async findBusinessDepartments(@Param("businessId") businessId: number) {
    return await this.adminService.findBusinessDepartments(businessId);
  }
}
