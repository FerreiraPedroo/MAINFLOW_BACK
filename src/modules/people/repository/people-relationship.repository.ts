import { Injectable } from "@nestjs/common";
import { People } from "@prisma/client";

import { LocalStorageContextData } from "@/common/context/interfaces/local-storage-context.data";
import { LocalStorageContextService } from "@/common/context/local-storage-context.service";

import { DatabaseService } from "@/common/infrastructure/database/prisma/database.service";

import { CreatePeopleRelationshipData } from "../types";

@Injectable()
export class PeopleRelationshipRepository {
  constructor(
    private readonly db: DatabaseService,
    private requestContext: LocalStorageContextService,
  ) {}

  async createPeopleRelationship(
    peopleRelationshipData: CreatePeopleRelationshipData,
  ): Promise<People> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.peopleRelationship.create({
      data: {
        ...peopleRelationshipData,
        business_unit_id: requestContext.business_unit_id,
        created_by: requestContext.user_id,
      },
    });
  }

  // async getPeople(peopleId: number): Promise<People | null> {
  //   const requestContext =
  //     this.requestContext.getStore() as LocalStorageContextData;

  //   return await this.prisma.people.findUnique({
  //     where: {
  //       id: Number(peopleId),
  //       business_unit_id: Number(requestContext.business_unit_id),
  //     },
  //   });
  // }
  // async findPeoples(): Promise<People[]> {
  //   const requestContext =
  //     this.requestContext.getStore() as LocalStorageContextData;

  //   return await this.prisma.people.findMany({
  //     where: { business_unit_id: Number(requestContext.business_unit_id) },
  //   });
  // }
  // async updatePeople(
  //   peopleId: number,
  //   peopleData: UpdatePeopleData,
  // ): Promise<People> {
  //   const requestContext =
  //     this.requestContext.getStore() as LocalStorageContextData;

  //   return await this.prisma.people.update({
  //     where: {
  //       id: Number(peopleId),
  //       business_unit_id: Number(requestContext.business_unit_id),
  //     },
  //     data: {
  //       ...peopleData,
  //       updated_by: Number(requestContext.user_id),
  //     },
  //   });
  // }
}
