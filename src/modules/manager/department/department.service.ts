import { Injectable } from "@nestjs/common";
import { DepartmentRepository } from "./repositories/department.repository";
import { DepartmentSectorRepository } from "./repositories/department-sector.repository";

@Injectable()
export class DepartmentService {
  constructor(
    private departmentRepository: DepartmentRepository,
    private departmentSectorRepository: DepartmentSectorRepository,
  ) {}

  async findAll() {
    const result = await this.departmentRepository.findAll();

    const departmentList = result.map((department) => ({
      id: department.id,
      title: department.title,
      url: department.url,
      icon: department.icon,
    }));

    return departmentList;
  }

  async findDepartmentSectorByUserId(userId: number, businessUnitId: number) {
    const departmentSector =
      await this.departmentSectorRepository.findDepartmetSectorByUserId(
        userId,
        businessUnitId,
      );

    return departmentSector;
  }

  // async create(body: CreateDepartmentDto) {
  //   return await this.departmentRepository.create({
  //     title: body.title,
  //     status: body.status,
  //     description: body.description ?? null,
  //     business_unit_id: 1,
  //   });
}
