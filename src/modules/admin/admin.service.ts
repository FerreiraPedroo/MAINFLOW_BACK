import { Injectable } from "@nestjs/common";
import { AdminRepository } from "./repositories/admin.repository";
import {
  BusinessDepartmentSector,
  SectorItem,
} from "./interfaces/business-unit-department-sectos.interface";

@Injectable()
export class AdminService {
  constructor(private adminRepository: AdminRepository) {}

  async getBusinessById(businessId: number) {
    return await this.adminRepository.getBusinessById(businessId);
  }

  async findBusinessDepartmentSectors(businessId: number) {
    const departmentsSectors =
      await this.adminRepository.findBusinessDepartmentSectors(businessId);

    if (!departmentsSectors) {
      return [];
    }

    const departmentsInfo: BusinessDepartmentSector[] = [];

    if (departmentsSectors) {
      for (const departmentSector of departmentsSectors) {
        const foundDepartmentInfo = departmentsInfo.find(
          (dpto) => dpto.id == departmentSector.department_id,
        );

        if (foundDepartmentInfo) {
          if (departmentSector.sector_id) {
            const foundSector = foundDepartmentInfo.itemsList.find(
              (sector): sector is SectorItem =>
                sector.id === departmentSector.sector_id &&
                "process_item" in sector,
            );

            if (foundSector) {
              foundSector.process_item.push(departmentSector.process_item);
            } else {
              foundDepartmentInfo.itemsList.push({
                ...(departmentSector.sector as SectorItem),
                process_item: [departmentSector.process_item],
              });
            }
          } else {
            foundDepartmentInfo.itemsList.push(departmentSector.process_item);
          }
        } else {
          const newDepartment: BusinessDepartmentSector = {
            id: departmentSector.id,
            title: departmentSector.department.title,
            url: departmentSector.department.url,
            icon: departmentSector.department.icon,
            itemsList: [],
          };

          if (departmentSector.sector) {
            newDepartment.itemsList.push({
              id: departmentSector.sector.id,
              department_id: departmentSector.sector.department_id,
              title: departmentSector.sector.title,
              icon: departmentSector.sector.icon,
              process_item: [departmentSector.process_item],
            });
          } else {
            newDepartment.itemsList.push(departmentSector.process_item);
          }

          departmentsInfo.push(newDepartment);
        }
      }
    }

    return departmentsInfo;
  }

  async findBusinessDepartments(businessId: number) {
    return await this.adminRepository.findBusinessDepartments(businessId);
  }
}
