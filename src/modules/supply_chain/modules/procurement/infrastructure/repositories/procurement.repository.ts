import { Injectable } from "@nestjs/common";

import { Procurement, ProcurementItem } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

import { DatabaseService } from "@/common/infrastructure/database/prisma/database.service";

import { LocalStorageContextService } from "@/common/context/local-storage-context.service";
import { LocalStorageContextData } from "@/common/context/interfaces/local-storage-context.data";

import {
  CreateProcurementInput,
  UpdateProcurementInput,
  GetProcurementRecord,
} from "../../contracts";

@Injectable()
export class ProcurementRepository {
  constructor(
    private readonly db: DatabaseService,
    private readonly requestContext: LocalStorageContextService,
  ) {}

  async getProcurement(procurementId: number): Promise<GetProcurementRecord> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.procurement.findUnique({
      where: {
        id: procurementId,
        business_unit_id: requestContext.business_unit_id,
      },
      include: {
        cost_center: true,
        project: true,
        inventory_items: {
          include: {
            inventory_item: {
              include: {
                manufacturer: true,
              },
            },
          },
        },
      },
    });
  }
  async findProcurements(): Promise<Procurement[]> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.procurement.findMany({
      where: { business_unit_id: Number(requestContext.business_unit_id) },
    });
  }
  async createProcurement(
    procurementData: CreateProcurementInput,
  ): Promise<Procurement> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    const data: any = {
      ...procurementData,
      business_unit_id: requestContext.business_unit_id,
      created_by: requestContext.user_id,
    };

    let procurement: Procurement;
    return await this.db.transaction(async () => {
      let retry = 10;

      while (retry > 0) {
        try {
          let code: string;

          const procurementRecord = await this.db.client.procurement.findFirst({
            orderBy: {
              id: "desc",
            },
            select: {
              id: true,
              code: true,
            },
          });

          if (!procurementRecord) {
            code = "P-00001";
          } else {
            const codeNumber = Number(procurementRecord.code.split("-")[1]);
            if (codeNumber <= 9) {
              code = `P-${"0".repeat(4)}${codeNumber + 1}`;
            } else if (codeNumber <= 99) {
              code = `P-${"0".repeat(3)}${codeNumber + 1}`;
            } else if (codeNumber <= 999) {
              code = `P-${"0".repeat(2)}${codeNumber + 1}`;
            } else if (codeNumber <= 9999) {
              code = `P-${"0".repeat(1)}${codeNumber + 1}`;
            } else {
              code = `P-${codeNumber + 1}`;
            }
          }

          data.code = code;
          procurement = await this.db.client.procurement.create(data);
        } catch (error) {
          if (
            error instanceof PrismaClientKnownRequestError &&
            error.code === "P2002"
          ) {
            retry--;
            continue;
          }
          throw error;
        }
      }

      if (!data.code) {
        throw new Error(
          "Não foi possível gerar um código único após várias tentativas.",
        );
      }
      return procurement;
    });
  }
  async procurementItems(procurementId: number): Promise<ProcurementItem[]> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.procurementItem.findMany({
      where: {
        procurement_id: procurementId,
        business_unit_id: requestContext.business_unit_id,
      },
    });
  }
  async updateProcurement(
    procurementId: number,
    procurementData: UpdateProcurementInput,
  ): Promise<Procurement> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.procurement.update({
      where: {
        id: procurementId,
        business_unit_id: requestContext.business_unit_id,
      },
      data: {
        ...procurementData,
      },
    });
  }
}
