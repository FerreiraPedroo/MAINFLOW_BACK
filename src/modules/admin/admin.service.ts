import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { AdminRepository } from "./repositories/admin.repository";

import {
  BusinessActivitiesData,
  Activity,
  SectorItem,
} from "./data/business-activities.data";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

import { CreateDepartmentRequest } from "./dto/create-department.request.dto";
import { DepartmentDataResponse } from "./dto/department-response.data";

import { CreateSectorRequest } from "./dto/create-sector.request";

import { BusinessActivity } from "./data/business-activity.interface";
import { GetBusinessByIdRecord } from "./types/record/get-business.record";
import { RemoveActivityToBusinessRequest } from "./dto/remove-activity-to-business.request.dto";

import { AddProcessToBusinessRequest } from "./dto/add-process-to-business.dto";
import { UpdateBusinessRequest } from "./types/dto/update-business-unit-request.dto";

@Injectable()
export class AdminService {
  constructor(private adminRepository: AdminRepository) {}

  private prismaErrors(error: any): never {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2001": {
          throw new UnprocessableEntityException(
            `O unidade de negócio não foi encontrada.`,
          );
          break;
        }
        case "P2002": {
          const meta = error.meta?.driverAdapterError as any;
          const fields = meta?.cause?.constraint?.fields
            ?.join(" / ")
            .toUpperCase();

          throw new UnprocessableEntityException(
            `Existe um unidade de negócio com esses dados: ${fields}`,
          );
          break;
        }
        default: {
          throw new UnprocessableEntityException(JSON.stringify(error.meta));
        }
      }
    } else {
      throw new UnprocessableEntityException(
        "Não foi possivel executar a ação.",
      );
    }
  }

  ///////////////////////////////////////////////////////////////////
  // BUSINESS
  async findBusiness() {
    try {
      const businessUnits = await this.adminRepository.findBusiness();

      return businessUnits.map((bu) => ({
        id: bu.id,
        title: bu.title,
        photos: bu.photos,
        cnpj: bu.cnpj,
      }));
    } catch (error) {
      this.prismaErrors(error);
    }
  }
  async getBusinessById(businessId: number) {
    let businessUnits: GetBusinessByIdRecord | null;

    try {
      businessUnits = await this.adminRepository.getBusinessById(businessId);
    } catch (error) {
      this.prismaErrors(error);
    }

    if (!businessUnits) {
      throw new UnprocessableEntityException(
        "Unidade de negócio não encontrada.",
      );
    }

    const businessUnitRecord = {
      id: businessUnits.id,
      title: businessUnits.title,
      photos: businessUnits.photos,
      cnpj: businessUnits.cnpj,
      address: {
        id: businessUnits.address.id,
        abbreviation: businessUnits.address.abbreviation,
        zone: businessUnits.address.zone,
        shortAddress: businessUnits.address.short_address,
        fullAddress: businessUnits.address.id,
        mapGoogle: businessUnits.address.map_google,
        coordinate: businessUnits.address.coordinate,
        photo: businessUnits.address.photo,
      },
    };

    return businessUnitRecord;
  }
  async updateBusiness(businessId: number, request: UpdateBusinessRequest) {
    try {
      const businessData = {
        ...(request.title && { title: request.title }),
        ...((request.photos || request.photos == null) && {
          photos: request.photos,
        }),
        ...(request.addressId && { address_id: request.addressId }),
        ...(request.cnpj && { title: request.cnpj }),
      };

      return await this.adminRepository.updateBusiness(
        businessId,
        businessData,
      );
    } catch (error) {
      this.prismaErrors(error);
    }
  }

  async findBusinessProcess(businessId: number) {
    const businessProcesses: BusinessActivity[] =
      await this.adminRepository.findBusinessActivities(businessId);

    if (!businessProcesses) {
      return [];
    }

    const processInfo: BusinessActivitiesData[] = [];

    if (businessProcesses.length) {
      for (const businessProcess of businessProcesses) {
        const foundProcessInfo = processInfo.find(
          (dpto) => dpto.id == businessProcess.department_id,
        );

        if (foundProcessInfo) {
          if (businessProcess.sector_id) {
            const foundSector = foundProcessInfo.activityList.find(
              (sector): sector is SectorItem =>
                sector.id === businessProcess.sector_id &&
                "activities" in sector,
            );

            if (foundSector) {
              foundSector.activities.push(businessProcess.activity);
            } else {
              foundProcessInfo.activityList.push({
                ...(businessProcess.sector as SectorItem),
                activities: [businessProcess.activity],
              });
            }
          } else {
            foundProcessInfo.activityList.push(businessProcess.activity);
          }
        } else {
          const newDepartment: BusinessActivitiesData = {
            id: businessProcess.department.id,
            title: businessProcess.department.title,
            url: businessProcess.department.url,
            icon: businessProcess.department.icon,
            activityList: [],
          };

          if (businessProcess.sector) {
            newDepartment.activityList.push({
              id: businessProcess.sector.id,
              department_id: businessProcess.department_id,
              title: businessProcess.sector.title,
              icon: businessProcess.sector.icon,
              activities: [businessProcess.activity],
            });
          } else {
            newDepartment.activityList.push(businessProcess.activity);
          }

          processInfo.push(newDepartment);
        }
      }
    }

    return processInfo;
  }

  async addProcessToBusiness(request: AddProcessToBusinessRequest) {
    if (!request.activities?.length) {
      throw new UnprocessableEntityException(
        "Nenhum atividade foi selecionado para associar a unidade de negócio.",
      );
    }

    const businessUnit = await this.getBusinessById(request.businessId);
    if (!businessUnit) {
      throw new UnprocessableEntityException(
        "Dados da unidade de negócio não encontrado.",
      );
    }

    const businessUnitProcess: BusinessActivity[] =
      await this.adminRepository.findBusinessActivities(request.businessId);

    if (businessUnitProcess.length) {
      const filterBusinessProcess = request.activities.filter((dp) => {
        return !businessUnitProcess.find(
          (bud) => bud.activity_id == dp.activityId,
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
          "O(s) atividade(s) já esta alocado a unidade de negócio.",
        );
      }
    } else {
      const businessProcess = await this.adminRepository.addProcessToBusiness(
        request.businessId,
        request.activities,
      );
      return businessProcess;
    }
  }

  async removeProcessToBusiness(request: RemoveActivityToBusinessRequest) {
    if (!request.activities?.length) {
      throw new UnprocessableEntityException(
        "Nenhuma atividade foi selecionado para remover da unidade de negócio.",
      );
    }

    const businessUnit = await this.getBusinessById(request.businessId);
    if (!businessUnit) {
      throw new UnprocessableEntityException(
        "Dados da unidade de negócio não encontrado.",
      );
    }

    const businessUnitProcess: BusinessActivity[] =
      await this.adminRepository.findBusinessActivities(request.businessId);

    if (businessUnitProcess.length) {
      const removeProcessIds = businessUnitProcess.filter((bup) => {
        return request.activities.find(
          (activityId) => bup.activity_id == activityId,
        );
      });

      if (removeProcessIds.length) {
        await this.adminRepository.removeProcessToBusiness(
          request.businessId,
          removeProcessIds.map((bup) => bup.id),
        );
        return "Atividade removido da unidade de negócio.";
      } else {
        throw new UnprocessableEntityException(
          "A atividade não esta alocado a unidade de negócio.",
        );
      }
    } else {
      throw new UnprocessableEntityException(
        "A unidade de negócio não tem nenhum atividade associado.",
      );
    }
  }

  ///////////////////////////////////////////////////////////////////
  // DEPARTMENTS
  async findDepartments(): Promise<DepartmentDataResponse[]> {
    const departments = await this.adminRepository.findDepartments();

    const departmentsInfo: DepartmentDataResponse[] = [];

    if (departments.length) {
      for (const department of departments) {
        const newDepartment: BusinessActivitiesData = {
          id: department.id,
          title: department.title,
          url: department.url,
          icon: department.icon,
          activityList: [],
        };

        // adiciona o atividade.
        department.activities.forEach((activity) => {
          if (!activity.sector_id) {
            newDepartment.activityList.push({
              id: activity.id,
              title: activity.title,
              url: activity.url,
              icon: activity.icon,
              department_id: activity.department_id,
              sector_id: activity.sector_id,
            });
          }
        });

        // adiciona o setor.
        department.sectors.forEach((sector) => {
          newDepartment.activityList.push({
            id: sector.id,
            department_id: sector.department_id,
            title: sector.title,
            icon: sector.icon,
            activities: [],
          });
        });

        // adiciona o atividade do setor.
        newDepartment.activityList.forEach((sector: SectorItem | Activity) => {
          if ("activity" in sector) {
            department.activities.forEach((activity) => {
              if (sector.id == activity.sector_id) {
                const sec = sector as SectorItem;
                sec.activities.push(activity);
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
  ///////////////////////////////////////////////////////////////////
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
