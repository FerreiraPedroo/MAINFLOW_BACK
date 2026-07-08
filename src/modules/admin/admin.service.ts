import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { AdminRepository } from "./repositories/admin.repository";
import {
  BusinessDepartmentSectorsData,
  SectorItem,
} from "./data/business-department-sectors.data";
import { CreateDepartmentRequest } from "./dto/create-department.request.dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { DepartmentDataResponse } from "./dto/department-response.data";
import { AddProcessToBusinessRequest } from "./dto/add-process-to-business.dto";
import { BusinessProcessData } from "./data/business-departments.data";
import { RemoveProcessToBusinessRequest } from "./dto/remove-process-to-business.request.dto";

@Injectable()
export class AdminService {
  constructor(private adminRepository: AdminRepository) {}
  //
  // BUSINESS
  async getBusinessById(businessId: number) {
    return await this.adminRepository.getBusinessById(businessId);
  }

  async findBusinessDepartments(businessId: number) {
    const businessDepartments: BusinessProcessData[] =
      await this.adminRepository.findBusinessProcess(businessId);

    if (!businessDepartments) {
      return [];
    }

    const departmentsInfo: BusinessDepartmentSectorsData[] = [];

    if (businessDepartments) {
      for (const businessDepartment of businessDepartments) {
        const foundDepartmentInfo = departmentsInfo.find(
          (dpto) => dpto.id == businessDepartment.business_unit_id,
        );

        if (foundDepartmentInfo) {
          if (businessDepartment.sector_id) {
            const foundSector = foundDepartmentInfo.itemsList.find(
              (sector): sector is SectorItem =>
                sector.id === businessDepartment.sector_id &&
                "process_item" in sector,
            );

            if (foundSector) {
              foundSector.process_item.push(businessDepartment.process_item.sector_id);
            } else {
              foundDepartmentInfo.itemsList.push({
                ...(businessDepartment.sector as SectorItem),
                process_item: [businessDepartment.process_item],
              });
            }
          } else {
            foundDepartmentInfo.itemsList.push(businessDepartment.process_item);
          }
        } else {
          const newDepartment: BusinessDepartmentSectorsData = {
            id: businessDepartment.id,
            title: businessDepartment.department.title,
            url: businessDepartment.department.url,
            icon: businessDepartment.department.icon,
            itemsList: [],
          };

          if (businessDepartment.sector) {
            newDepartment.itemsList.push({
              id: businessDepartment.sector.id,
              department_id: businessDepartment.sector.department_id,
              title: businessDepartment.sector.title,
              icon: businessDepartment.sector.icon,
              process_item: [businessDepartment.process_item],
            });
          } else {
            newDepartment.itemsList.push(businessDepartment.process_item);
          }

          departmentsInfo.push(newDepartment);
        }
      }
    }

    return departmentsInfo;
  }

  async addProcessToBusiness(request: AddProcessToBusinessRequest) {
    if (!request.processItems.length) {
      throw new UnprocessableEntityException(
        "Nenhum processo foi selecionado para associar a unidade de negócio.",
      );
    }

    const businessUnit = await this.getBusinessById(request.businessId);
    if (!businessUnit) {
      throw new UnprocessableEntityException(
        "Dados da unidade de negócio não encontrado.",
      );
    }

    const businessUnitProcess: BusinessProcessData[] =
      await this.adminRepository.findBusinessProcess(request.businessId);

    if (businessUnitProcess.length) {
      const filterBusinessProcess = request.processItems.filter((dp) => {
        return !businessUnitProcess.find(
          (bud) => bud.process_item_id == dp.processItemId,
        );
      });

      if (filterBusinessProcess.length) {
        const businessProcess = await this.adminRepository.addProcessToBusiness(
          request.businessId,
          filterBusinessProcess,
        );
        return businessProcess;
      } else {
        throw new UnprocessableEntityException(
          "O(s) processo(s) já esta alocado a unidade de negócio.",
        );
      }
    } else {
      const businessProcess = await this.adminRepository.addProcessToBusiness(
        request.businessId,
        request.processItems,
      );
      return businessProcess;
    }
  }

  async removeProcessToBusiness(request: RemoveProcessToBusinessRequest) {
    if (!request.processItems.length) {
      throw new UnprocessableEntityException(
        "Nenhum processo foi selecionado para remover da unidade de negócio.",
      );
    }

    const businessUnit = await this.getBusinessById(request.businessId);
    if (!businessUnit) {
      throw new UnprocessableEntityException(
        "Dados da unidade de negócio não encontrado.",
      );
    }

    const businessUnitProcess: BusinessProcessData[] =
      await this.adminRepository.findBusinessProcess(request.businessId);

    if (businessUnitProcess.length) {
      const removeBusinessProcess = businessUnitProcess.filter((bup) => {
        return request.processItems.find(
          (dp) => bup.process_item_id == dp.processItemId,
        );
      });

      if (removeBusinessProcess.length) {
        await this.adminRepository.removeProcessToBusiness(
          request.businessId,
          removeBusinessProcess.map((bup) => bup.id),
        );
        return "Processo removido da unidade de negócio.";
      } else {
        throw new UnprocessableEntityException(
          "O processo não esta alocado a unidade de negócio.",
        );
      }
    } else {
      throw new UnprocessableEntityException(
        "A unidade de negócio não tem nenhum processo associado.",
      );
    }
  }

  // DEPARTMENTS
  async findDepartments(): Promise<DepartmentDataResponse[]> {
    const departments = await this.adminRepository.findDepartments();

    const departmentsInfo: DepartmentDataResponse[] = [];

    if (departments) {
      for (const department of departments) {
        const foundDepartmentInfo = departmentsInfo.find(
          (dpto) => dpto.id == department.id,
        );

        if (foundDepartmentInfo) {
          if (department.sector) {
            const foundSector = foundDepartmentInfo.itemsList.find(
              (sector): sector is SectorItem =>
                sector.id === department.sector?.id && "process_item" in sector,
            );

            if (foundSector) {
              foundSector.process_item.push(department.process_item);
            } else {
              foundDepartmentInfo.itemsList.push({
                ...(department.sector as SectorItem),
                process_item: [department.process_item],
              });
            }
          } else {
            if (department.process_item) {
              foundDepartmentInfo.itemsList.push(department.process_item);
            }
          }
        } else {
          const newDepartment: BusinessDepartmentSectorsData = {
            id: department.id,
            title: department.title,
            url: department.url,
            icon: department.icon,
            itemsList: [],
          };

          if (department.sector) {
            newDepartment.itemsList.push({
              id: department.sector.id,
              department_id: department.sector.department_id,
              title: department.sector.title,
              icon: department.sector.icon,
              process_item: [department.process_item],
            });
          } else {
            if (department.process_item) {
              newDepartment.itemsList.push(department.process_item);
            }
          }

          departmentsInfo.push(newDepartment);
        }
      }
    }

    return departmentsInfo;
  }

  async createDepartment(body: CreateDepartmentRequest) {
    try {
      return await this.adminRepository.createDepartment(body);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new UnprocessableEntityException(
            `Existe um departamento com esse nome.`,
          );
        }
      }
      throw new UnprocessableEntityException(error);
    }
  }
}
