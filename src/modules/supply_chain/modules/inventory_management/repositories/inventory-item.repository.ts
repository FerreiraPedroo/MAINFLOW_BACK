import { Injectable } from "@nestjs/common";

// import { Inventory, InventoryItem } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

import { DatabaseService } from "@/common/infrastructure/database/prisma/database.service";

import { LocalStorageContextService } from "@/common/context/local-storage-context.service";
import { LocalStorageContextData } from "@/common/context/interfaces/local-storage-context.data";

import {
  CreateInventoryItemInput,
  UpdateInventoryItemInput,
  GetInventoryItemRecord,
} from "../types";
import { InventoryItem } from "@prisma/client";

@Injectable()
export class InventoryItemRepository {
  constructor(
    private readonly db: DatabaseService,
    private readonly requestContext: LocalStorageContextService,
  ) {}

  async getInventoryItem(
    inventoryItemId: number,
  ): Promise<GetInventoryItemRecord> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.inventoryItem.findUnique({
      where: {
        id: inventoryItemId,
        business_unit_id: requestContext.business_unit_id,
      },
      include: {
        manufacturer: true,
      },
    });
  }
  async findInventoryItems(): Promise<InventoryItem[]> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.inventoryItem.findMany({
      where: { business_unit_id: requestContext.business_unit_id },
    });
  }
  async createInventoryItem(
    inventoryItemInput: CreateInventoryItemInput,
  ): Promise<InventoryItem> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    const data: any = {
      ...inventoryItemInput,
      business_unit_id: requestContext.business_unit_id,
      created_by: requestContext.user_id,
    };

    const xprisma = this.db.client.$extends((client: any) => {
      return client.$extends({
        query: {
          inventoryItem: {
            async create({ args, query }: any) {
              let retry = 15;

              while (retry > 0) {
                try {
                  let code: string;

                  const inventoryRecord = await client.inventoryItem.findFirst({
                    orderBy: {
                      id: "desc",
                    },
                    select: {
                      id: true,
                      code: true,
                    },
                  });

                  if (!inventoryRecord) {
                    code = "R-00001";
                  } else {
                    const codeNumber = Number(
                      inventoryRecord.code.split("-")[1],
                    );
                    if (codeNumber <= 9) {
                      code = `R-${"0".repeat(4)}${codeNumber + 1}`;
                    } else if (codeNumber <= 99) {
                      code = `R-${"0".repeat(3)}${codeNumber + 1}`;
                    } else if (codeNumber <= 999) {
                      code = `R-${"0".repeat(2)}${codeNumber + 1}`;
                    } else if (codeNumber <= 9999) {
                      code = `R-${"0".repeat(1)}${codeNumber + 1}`;
                    } else {
                      code = `R-${codeNumber + 1}`;
                    }
                  }

                  // 1. Gera o código e injeta nos argumentos antes de salvar
                  args.data.code = code;
                  // 2. Executa a query original de criação
                  return await query(args);
                } catch (error) {
                  // P2002 é o código do Prisma para erro de Unique Constraint
                  if (
                    error instanceof PrismaClientKnownRequestError &&
                    error.code === "P2002"
                  ) {
                    retry--;
                    continue;
                  }
                  // Se for outro erro, repassa para frente
                  throw error;
                }
              }

              if (!args.data.code) {
                throw new Error(
                  "Não foi possível gerar um código único após várias tentativas.",
                );
              }
            },
          },
        },
      });
    });

    return await xprisma.inventoryItem.create({
      data,
    });
  }
  async updateInventoryItem(
    inventoryId: number,
    inventoryItemInput: UpdateInventoryItemInput,
  ): Promise<InventoryItem> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.inventoryItem.update({
      where: {
        id: inventoryId,
        business_unit_id: requestContext.business_unit_id,
        updated_by: requestContext.user_id,
      },
      data: {
        ...inventoryItemInput,
      },
    });
  }
}
