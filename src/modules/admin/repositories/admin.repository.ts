import { PrismaService } from "@/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { BusinessUnit, Department } from "@prisma/client";
import { BusinessDepartmentData } from "../data/business-departments.data";
import { CreateDepartmentRequest } from "../dto/create-department.request.dto";
import { DepartmentData } from "../data/department-data.interface";

@Injectable()
export class AdminRepository {
  constructor(private prisma: PrismaService) {}

  // BUSINESS
  async getBusinessById(businessId: number): Promise<BusinessUnit | null> {
    return await this.prisma.businessUnit.findUnique({
      where: { id: Number(businessId) },
    });
  }
  async findBusinessDepartments(
    businessId: number,
  ): Promise<BusinessDepartmentData[]> {
    return await this.prisma.$queryRaw`
      SELECT bud.*,
        TO_JSONB(d) as department,
        TO_JSONB(s) as sector,
        TO_JSONB(i) as process_item
      FROM "BusinessUnitDepartment" bud
      JOIN "Department" d
        ON d.id = bud.department_id
      LEFT JOIN "Sector" s
        ON s.id = bud.sector_id
      JOIN "ProcessItem" i
        ON i.id = bud.process_item_id
      WHERE bud.business_unit_id = ${Number(businessId)}
      GROUP BY bud.id, d.id, s.id, i.id
    `;
  }
  async addDepartmentToBusiness(
    businessId: number,
    processItems: {
      departmentId: number;
      sectorId: number | null;
      processItemId: number;
    }[],
  ) {
    const queryValues = processItems
      .map(
        (pi) =>
          `(${businessId}), ${pi.departmentId}, ${pi.sectorId}, ${pi.processItemId})`,
      )
      .join(",");
    console.log({ queryValues });
    return await this.prisma.$queryRaw`
      INSERT INTO "BusinessUnitDepartment" 
      ("business_unit_id", "department_id", "sector_id", "process_item_id")
      VALUES ${queryValues}
    `;
  }

  // DEPARTMENTS
  async findDepartments(): Promise<DepartmentData[]> {
    // return await this.prisma.department.findMany();
    return await this.prisma.$queryRaw`
      SELECT d.*,
        TO_JSONB(s) as sector,
        TO_JSONB(i) as process_item
      FROM "Department" d
      LEFT JOIN "ProcessItem" i
        ON i.department_id = d.id
      LEFT JOIN "Sector" s
        ON s.department_id = d.id AND s.id = i.sector_id
      GROUP BY d.id, s.id, i.id
    `;
  }
  async createDepartment(data: CreateDepartmentRequest): Promise<Department> {
    return await this.prisma.department.create({
      data: {
        title: data.title,
        url: data.url,
        icon: data.icon,
      },
    });
  }
}
