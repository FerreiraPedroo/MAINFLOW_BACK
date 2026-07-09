import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { AdminRepository } from "./repositories/admin.repository";
import {
  BusinessDepartmentSectorsData,
  ProcessItem,
  SectorItem,
} from "./data/business-department-sectors.data";
import { CreateDepartmentRequest } from "./dto/create-department.request.dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { DepartmentDataResponse } from "./dto/department-response.data";
import { AddProcessToBusinessRequest } from "./dto/add-process-to-business.dto";
import { BusinessProcessData } from "./data/business-departments.data";
import { RemoveProcessToBusinessRequest } from "./dto/remove-process-to-business.request.dto";
import { Sector } from "@prisma/client";
import { CreateSectorRequest } from "./dto/create-sector.request";

@Injectable()
export class AdminService {
  constructor(private adminRepository: AdminRepository) {}
  //
  // BUSINESS
  async getBusinessById(businessId: number) {
    return await this.adminRepository.getBusinessById(businessId);
  }

  async findBusinessProcess(businessId: number) {
    const businessProcesses: BusinessProcessData[] =
      await this.adminRepository.findBusinessProcess(businessId);

    if (!businessProcesses) {
      return [];
    }

    const processInfo: BusinessDepartmentSectorsData[] = [];

    if (businessProcesses.length) {
      for (const businessProcess of businessProcesses) {
        const foundProcessInfo = processInfo.find(
          (dpto) => dpto.id == businessProcess.business_unit_id,
        );

        if (foundProcessInfo) {
          if (businessProcess.sector_id) {
            const foundSector = foundProcessInfo.itemsList.find(
              (sector): sector is SectorItem =>
                sector.id === businessProcess.sector_id &&
                "process_item" in sector,
            );

            if (foundSector) {
              foundSector.process_item.push(businessProcess.process_item);
            } else {
              foundProcessInfo.itemsList.push({
                ...(businessProcess.sector as SectorItem),
                process_item: [businessProcess.process_item],
              });
            }
          } else {
            foundProcessInfo.itemsList.push(businessProcess.process_item);
          }
        } else {
          const newDepartment: BusinessDepartmentSectorsData = {
            id: businessProcess.department.id,
            title: businessProcess.department.title,
            url: businessProcess.department.url,
            icon: businessProcess.department.icon,
            itemsList: [],
          };

          if (businessProcess.sector) {
            newDepartment.itemsList.push({
              id: businessProcess.sector.id,
              department_id: businessProcess.sector.department_id,
              title: businessProcess.sector.title,
              icon: businessProcess.sector.icon,
              process_item: [businessProcess.process_item],
            });
          } else {
            newDepartment.itemsList.push(businessProcess.process_item);
          }

          processInfo.push(newDepartment);
        }
      }
    }

    return processInfo;
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
      const removeProcessIds = businessUnitProcess.filter((bup) => {
        return request.processItems.find(
          (processItemId) => bup.process_item_id == processItemId,
        );
      });

      if (removeProcessIds.length) {
        await this.adminRepository.removeProcessToBusiness(
          request.businessId,
          removeProcessIds.map((bup) => bup.id),
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

    if (departments.length) {
      for (const department of departments) {
        const newDepartment: BusinessDepartmentSectorsData = {
          id: department.id,
          title: department.title,
          url: department.url,
          icon: department.icon,
          itemsList: [],
        };

        // adiciona o processo.
        department.process_item.forEach((process) => {
          if (!process.sector_id) {
            newDepartment.itemsList.push({
              id: process.id,
              title: process.title,
              url: process.url,
              icon: process.icon,
              department_id: process.department_id,
              sector_id: process.sector_id,
            });
          }
        });

        // adiciona o setor.
        department.sector.forEach((sector) => {
          newDepartment.itemsList.push({
            id: sector.id,
            department_id: sector.department_id,
            title: sector.title,
            icon: sector.icon,
            process_item: [],
          });
        });

        // adiciona o processo do setor.
        newDepartment.itemsList.forEach((sector: SectorItem | ProcessItem) => {
          if ("process_item" in sector) {
            department.process_item.forEach((process) => {
              if (sector.id == process.sector_id) {
                sector.process_item.push(process);
              }
            });
          }
        });

        departmentsInfo.push(newDepartment);
      }
    }

    return departmentsInfo;
  }

  async createDepartment(request: CreateDepartmentRequest) {
    const departmentData = {
      title: request.title,
      url: request.url,
      icon: request.icon,
    };

    try {
      return await this.adminRepository.createDepartment(departmentData);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code == "P2002"
      ) {
        throw new UnprocessableEntityException(
          "Existe um departamento com esse nome.",
        );
      } else {
        throw new UnprocessableEntityException("Erro ao criar o departamento.");
      }
    }
  }

  // SECTOR
  async createSector(request: CreateSectorRequest) {
    const sectorData = {
      title: request.title,
      icon: request.icon ?? null,
      department_id: request.departmentId,
    };

    try {
      await this.adminRepository.createSector(sectorData);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code == "P2002"
      ) {
        throw new UnprocessableEntityException(
          "Existe um setor com esse nome.",
        );
      } else {
        throw new UnprocessableEntityException("Erro ao criar o setor.");
      }
    }
  }
}
