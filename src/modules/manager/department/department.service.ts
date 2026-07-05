import { Injectable } from "@nestjs/common";
import { DepartmentRepository } from "./repositories/department.repository";
import { UserDepartmentSectorRepository } from "./repositories/department-sector.repository";
import { AlsContextService } from "@/common/context/als-context.service";
import { RequestAlsContext } from "@/common/context/interfaces/request-als.context.interface";

@Injectable()
export class DepartmentService {
  constructor(
    private departmentRepository: DepartmentRepository,
    private userDepartmentSectorRepository: UserDepartmentSectorRepository,
    private requestContext: AlsContextService,
  ) {}

  // DEPARTMENT
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

  // DEPARTMENT-SECTOR ///////////////////////////////////////////
  async findUserDepartmentSectorByUserId() {
    const userData = this.requestContext.getStore() as RequestAlsContext;

    const userDepartmentSector =
      await this.userDepartmentSectorRepository.findDepartmetSectorByUserId(
        userData.userId,
        userData.businessUnitId,
      );

    return userDepartmentSector;
  }
  async findUserDepartmentSectorByUserIdForLogin(
    userId: number,
    businessUnitId: number,
  ) {
    const userDepartmentSector =
      await this.userDepartmentSectorRepository.findDepartmetSectorByUserId(
        userId,
        businessUnitId,
      );

    return userDepartmentSector;
  }

  // async create(body: CreateDepartmentDto) {
  //   return await this.departmentRepository.create({
  //     title: body.title,
  //     status: body.status,
  //     description: body.description ?? null,
  //     business_unit_id: 1,
  //   });
}
