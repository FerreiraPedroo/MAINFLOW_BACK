import { Injectable } from "@nestjs/common";

import { LocalStorageContextData } from "@/common/context/interfaces/local-storage-context.data";
import { LocalStorageContextService } from "@/common/context/local-storage-context.service";

import { PrismaService } from "@database/prisma/prisma.service";

import { People } from "@prisma/client";
import { CreatePeopleData } from "../types/data/create-people.data";
import { UpdatePeopleData } from "../types/data/update-people.data";

@Injectable()
export class PeopleRepository {
  constructor(
    private prisma: PrismaService,
    private requestContext: LocalStorageContextService,
  ) {}

  async getPeople(peopleId: number): Promise<People | null> {
    const userData = this.requestContext.getStore() as LocalStorageContextData;

    return await this.prisma.people.findUnique({
      where: {
        id: Number(peopleId),
        business_unit_id: Number(userData.businessUnitId),
      },
    });
  }
  async findPeoples(): Promise<People[]> {
    const userData = this.requestContext.getStore() as LocalStorageContextData;

    return await this.prisma.people.findMany({
      where: { business_unit_id: Number(userData.businessUnitId) },
    });
  }
  async createPeople(peopleData: CreatePeopleData): Promise<People> {
    const userData = this.requestContext.getStore() as LocalStorageContextData;

    return await this.prisma.people.create({
      data: {
        ...peopleData,
        business_unit_id: Number(userData.businessUnitId),
        created_by: Number(userData.userId),
      },
    });
  }
  async updatePeople(
    peopleId: number,
    peopleData: UpdatePeopleData,
  ): Promise<People> {
    const userData = this.requestContext.getStore() as LocalStorageContextData;

    return await this.prisma.people.update({
      where: {
        id: Number(peopleId),
        business_unit_id: Number(userData.businessUnitId),
      },
      data: {
        ...peopleData,
        updated_by: Number(userData.userId),
      },
    });
  }
}
