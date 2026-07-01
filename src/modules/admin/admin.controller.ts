import { Controller, Get, Param } from "@nestjs/common";
import { AdminService } from "./admin.service";

@Controller("/admin")
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get("/business-unit")
  async findBusinessUnitById(@Param("id") id: number) {
    return await this.adminService.findBusinessUnitById(id);
  }
}
