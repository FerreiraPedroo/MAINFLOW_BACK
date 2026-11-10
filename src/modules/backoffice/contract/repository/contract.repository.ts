import { Injectable } from "@nestjs/common";
import { Contract } from "@prisma/client";

import { DatabaseService } from "@/common/infrastructure/database/prisma/database.service";

import { LocalStorageContextService } from "@/common/context/local-storage-context.service";
import { LocalStorageContextData } from "@/common/context/interfaces/local-storage-context.data";
import {
  CreateContractData,
  FindContractInput,
  FindContractOutputData,
  UpdateContractData,
} from "../types";

@Injectable()
export class ContractRepository {
  constructor(
    private readonly db: DatabaseService,
    private readonly requestContext: LocalStorageContextService,
  ) {}

  async create(contractData: CreateContractData): Promise<Contract> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.contract.create({
      data: {
        ...contractData,
        business_unit_id: requestContext.business_unit_id,
        created_by: requestContext.user_id,
      },
    });
  }
  async update(
    contractId: number,
    contractData: UpdateContractData,
  ): Promise<Contract> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.contract.update({
      where: {
        id: contractId,
        business_unit_id: requestContext.business_unit_id,
      },
      data: {
        ...contractData,
        updated_by: requestContext.user_id,
      },
    });
  }
  async find({
    cursor,
    limit,
    ...queries
  }: FindContractInput): Promise<FindContractOutputData> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    const result = await this.db.client.contract.findMany({
      take: limit,
      skip: cursor ? 1 : undefined,
      cursor: cursor ? { id: cursor } : undefined,
      where: queries
        ? {
            AND: [
              ...Object.entries(queries).map(([key, value]) => ({
                [key]: value,
              })),
              { business_unit_id: requestContext.business_unit_id },
            ],
          }
        : undefined,
      orderBy: { id: "asc" },
    });

    return { contracts: result, cursor: result.at(-1)?.id ?? 1 };
  }
  async findAll(): Promise<Contract[]> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.contract.findMany({
      where: {
        business_unit_id: requestContext.business_unit_id,
      },
    });
  }
}
