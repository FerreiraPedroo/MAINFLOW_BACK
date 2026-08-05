import { Injectable } from "@nestjs/common";

import { LocalStorageContextData } from "@/common/context/interfaces/local-storage-context.data";
import { LocalStorageContextService } from "@/common/context/local-storage-context.service";

import { DatabaseService } from "@/common/infrastructure/database/prisma/database.service";

import { People } from "@prisma/client";
import { CreatePeopleData } from "../types/data/create-people.data";
import { UpdatePeopleData } from "../types/data/update-people.data";

@Injectable()
export class PeopleRepository {
  constructor(
    private readonly db: DatabaseService,
    private readonly requestContext: LocalStorageContextService,
  ) {}

  async getPeople(peopleId: number): Promise<People | null> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.people.findUnique({
      where: {
        id: Number(peopleId),
        business_unit_id: Number(requestContext.business_unit_id),
      },
    });
  }
  async findPeoples(): Promise<People[]> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.people.findMany({
      where: { business_unit_id: Number(requestContext.business_unit_id) },
    });
  }
  async createPeople(peopleData: CreatePeopleData): Promise<People> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.people.create({
      data: {
        ...peopleData,
        business_unit_id: Number(requestContext.business_unit_id),
        created_by: Number(requestContext.user_id),
      },
    });
  }
  async updatePeople(
    peopleId: number,
    peopleData: UpdatePeopleData,
  ): Promise<People> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.people.update({
      where: {
        id: Number(peopleId),
        business_unit_id: Number(requestContext.business_unit_id),
      },
      data: {
        ...peopleData,
        updated_by: Number(requestContext.user_id),
      },
    });
  }
}
