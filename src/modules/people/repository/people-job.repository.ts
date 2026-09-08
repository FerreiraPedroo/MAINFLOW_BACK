import { Injectable } from "@nestjs/common";

import { LocalStorageContextData } from "@/common/context/interfaces/local-storage-context.data";
import { LocalStorageContextService } from "@/common/context/local-storage-context.service";

import { DatabaseService } from "@/common/infrastructure/database/prisma/database.service";

import { People, PeopleJob } from "@prisma/client";
import { ChangePeopleJobInput, UpdatePeopleJobInput } from "../types";

@Injectable()
export class PeopleJobRepository {
  constructor(
    private readonly db: DatabaseService,
    private readonly requestContext: LocalStorageContextService,
  ) {}

  async findJobsByPeopleId(people_id: number): Promise<PeopleJob[]> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.peopleJob.findMany({
      where: {
        people_id,
        business_unit_id: requestContext.business_unit_id,
      },
    });
  }
  // async getPeople(peopleId: number): Promise<People | null> {
  //   const requestContext =
  //     this.requestContext.getStore() as LocalStorageContextData;

  //   return await this.db.client.people.findUnique({
  //     where: {
  //       id: Number(peopleId),
  //       business_unit_id: Number(requestContext.business_unit_id),
  //     },
  //   });
  // }
  // async findPeoples(): Promise<People[]> {
  //   const requestContext =
  //     this.requestContext.getStore() as LocalStorageContextData;

  //   return await this.db.client.people.findMany({
  //     where: { business_unit_id: Number(requestContext.business_unit_id) },
  //   });
  // }
  async changePeopleJob(
    changePeopleJob: ChangePeopleJobInput,
  ): Promise<PeopleJob> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.peopleJob.create({
      data: {
        ...changePeopleJob,
        business_unit_id: requestContext.business_unit_id,
        created_by: requestContext.user_id,
      },
    });
  }
  async updatePeopleJob(
    people_job_id: number,
    peopleJobData: UpdatePeopleJobInput,
  ): Promise<People> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.people.update({
      where: {
        id: people_job_id,
        business_unit_id: requestContext.business_unit_id,
      },
      data: {
        ...peopleJobData,
        updated_by: requestContext.user_id,
      },
    });
  }
}
