import { Injectable } from "@nestjs/common";
import { People, PeopleRelationship } from "@prisma/client";

import { LocalStorageContextData } from "@/common/context/interfaces/local-storage-context.data";
import { LocalStorageContextService } from "@/common/context/local-storage-context.service";

import { DatabaseService } from "@/common/infrastructure/database/prisma/database.service";

import {
  CreatePeopleRelationshipData,
  GetPeopleRelationshipRecord,
} from "../types";
import { includes } from "zod";

@Injectable()
export class PeopleRelationshipRepository {
  constructor(
    private readonly db: DatabaseService,
    private readonly requestContext: LocalStorageContextService,
  ) {}

  async createPeopleRelationship(
    peopleRelationshipData: CreatePeopleRelationshipData,
  ): Promise<PeopleRelationship> {
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
  async deletePeopleRelationship(
    relationshipId: number,
  ): Promise<PeopleRelationship> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.peopleRelationship.delete({
      where: {
        id: relationshipId,
        business_unit_id: requestContext.business_unit_id,
      },
    });
  }
  async getPeopleRelationship(
    peopleId: number,
  ): Promise<GetPeopleRelationshipRecord[]> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.peopleRelationship.findMany({
      where: {
        people_id: peopleId,
        business_unit_id: requestContext.business_unit_id,
      },
      include: {
        people: true,
        related_person: true,
      },
    });
  }
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

  // async findPeoples(): Promise<People[]> {
  //   const requestContext =
  //     this.requestContext.getStore() as LocalStorageContextData;

  //   return await this.prisma.people.findMany({
  //     where: { business_unit_id: Number(requestContext.business_unit_id) },
  //   });
  // }
}
