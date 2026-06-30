import { Body, Controller, Get, Post, Query } from "@nestjs/common";

import { DepartmentService } from "./department.service";

@Controller("/manager/department")
export class DepartmentController {
  constructor(private departmentService: DepartmentService) {}

  @Get()
  async findDepartmentSector() {
    const userId = 1;
    const businessUnitId = 1;

    try {
      const departmentList =
        await this.departmentService.findDepartmentSectorByUserId(
          userId,
          businessUnitId,
        );
-,,,,,,,

      return { codStatus: 200, data: departmentList };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { codStatus: 500, message: error.message };
      }
      return { codStatus: 500, message: "Erro do servidor." };
    }
  }

  // @Post()
  // async createDepartment(@Body() body: CreateDepartmentDto) {
  //   try {
  //     const departmentCreated = await this.departmentService.create(body);
  //     return { codStatus: 200, data: departmentCreated };
  //   } catch (error: unknown) {
  //     if (error instanceof Error) {
  //       return { codStatus: 500, message: error.message };
  //     }
  //     return { codStatus: 500, message: "Erro do servidor." };
  //   }
  // }
}
