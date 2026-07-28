import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { BusinessUnit, BusinessUnitActivity } from "@prisma/client";

import { AdminRepository } from "./repositories/admin.repository";

import { Activity, SectorItem } from "./data/business-activities.data";

import { CreateDepartmentRequest } from "./dto/create-department.request.dto";

import { CreateSectorRequest } from "./dto/create-sector.request";

import {
  AddActivityToBusinessInput,
  FindBusinessActivitiesRecord,
  FindDepartmentsOutput,
  GetBusinessActivitiesOutput,
  UpdateBusinessInput,
} from "./types";

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

  ///////////////////////////////////////////////////////////////////////
  // BUSINESS
  ///////////////////////////////////////////////////////////////////////
  async findBusiness() {
    try {
      return await this.adminRepository.findBusiness();
    } catch (error) {
      this.prismaErrors(error);
    }
  }
  async getBusinessById(business_id: number) {
    let businessUnit: BusinessUnit | null;

    try {
      businessUnit = await this.adminRepository.getBusinessById(business_id);
    } catch (error) {
      this.prismaErrors(error);
    }

    if (!businessUnit) {
      throw new UnprocessableEntityException(
        "Unidade de negócio não encontrada.",
      );
    }

    return businessUnit;
  }
  async updateBusiness(business_id: number, businessData: UpdateBusinessInput) {
    try {
      return await this.adminRepository.updateBusiness(
        business_id,
        businessData,
      );
    } catch (error) {
      this.prismaErrors(error);
    }
  }
  async findBusinessActivities(business_id: number) {
    const businessActivities: FindBusinessActivitiesRecord[] =
      await this.adminRepository.findBusinessActivities(business_id);

    if (!businessActivities) {
      return [];
    }

    const activitiesInfo: GetBusinessActivitiesOutput[] = [];

    if (businessActivities.length) {
      for (const activitiesRecord of businessActivities) {
        const foundActivityInfo = activitiesInfo.find(
          (dpto) => dpto.id == activitiesRecord.department_id,
        );

        if (foundActivityInfo) {
          if (activitiesRecord.sector_id) {
            const foundSector = foundActivityInfo.activities.find(
              (sector): sector is SectorItem =>
                sector.id === activitiesRecord.sector_id &&
                "activities" in sector,
            );

            if (foundSector) {
              foundSector.activities.push(activitiesRecord.activity);
            } else {
              foundActivityInfo.activities.push({
                ...(activitiesRecord.sector as SectorItem),
                activities: [activitiesRecord.activity],
              });
            }
          } else {
            foundActivityInfo.activities.push(activitiesRecord.activity);
          }
        } else {
          const newDepartment: GetBusinessActivitiesOutput = {
            ...activitiesRecord.department,
            activities: [],
          };

          if (activitiesRecord.sector) {
            newDepartment.activities.push({
              ...activitiesRecord.sector,
              activities: [activitiesRecord.activity],
            });
          } else {
            newDepartment.activities.push(activitiesRecord.activity);
          }

          activitiesInfo.push(newDepartment);
        }
      }
    }

    return activitiesInfo;
  }
  async addActivityToBusiness(
    business_id: number,
    activity_id: number,
    businessActivity: AddActivityToBusinessInput,
  ) {
    let businessActivitiesRecord: BusinessUnitActivity[];
    try {
      businessActivitiesRecord =
        await this.adminRepository.findBusinessActivities(business_id);
    } catch (error) {
      this.prismaErrors(error);
    }

    if (businessActivitiesRecord.length) {
      const activities = businessActivitiesRecord.find(
        (bur) => bur.activity_id == activity_id,
      );

      if (activities) {
        throw new UnprocessableEntityException(
          "A atividade já esta alocada na unidade de negócio.",
        );
      }
    }

    return await this.adminRepository.addActivityToBusiness(
      business_id,
      activity_id,
      businessActivity,
    );
  }
  async removeActivitFromBusiness(business_id: number, activity_id: number) {
    const businessUnit = await this.getBusinessById(business_id);
    if (!businessUnit) {
      throw new UnprocessableEntityException(
        "Dados da unidade de negócio não encontrado.",
      );
    }

    const businessActivitiesRecord: BusinessUnitActivity[] =
      await this.adminRepository.findBusinessActivities(business_id);

    if (businessActivitiesRecord.length) {
      const removeProcessId = businessActivitiesRecord.find((bup) => {
        return bup.activity_id == activity_id;
      });

      if (removeProcessId) {
        await this.adminRepository.removeActivityFromBusiness(
          business_id,
          removeProcessId.id,
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

  ///////////////////////////////////////////////////////////////////////
  // DEPARTMENT
  ///////////////////////////////////////////////////////////////////////
  async findDepartments(): Promise<FindDepartmentsOutput[]> {
    const departments = await this.adminRepository.findDepartments();

    const departmentsInfo: FindDepartmentsOutput[] = [];

    if (departments.length) {
      for (const department of departments) {
        const newDepartment: any = {
          ...department,
          activities: [],
        };

        // adiciona o atividade.
        department.activities.forEach((activity) => {
          if (!activity.sector_id) {
            newDepartment.activities.push(activity);
          }
        });

        // adiciona o setor.
        department.sectors.forEach((sector) => {
          newDepartment.activities.push({ ...sector, activities: [] });
        });

        // adiciona o atividade do setor.
        newDepartment.activities.forEach((sector: SectorItem | Activity) => {
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
