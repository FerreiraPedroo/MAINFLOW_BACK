import { Injectable } from "@nestjs/common";
import { ProcurementItem } from "@prisma/client";

import { PrismaService } from "@/database/prisma/prisma.service";
import { LocalStorageContextService } from "@/common/context/local-storage-context.service";
import { LocalStorageContextData } from "@/common/context/interfaces/local-storage-context.data";

import { CreateProcurementItemData } from "../types/data/create-procurement-item.data";
import { ProcurementItemRepository } from "../types/interfaces/procurement-item.repository.interface";

import { UpdateProcurementItemData } from "../types/data/update-procurement-item.data";

@Injectable()
export class ProcurementItemPrismaRepository implements ProcurementItemRepository {
  constructor(
    private prisma: PrismaService,
    private requestContext: LocalStorageContextService,
  ) {}

  async findProcurementItens(
    procurementId: number,
  ): Promise<ProcurementItem[]> {
    const userContext =
      this.requestContext.getStore() as LocalStorageContextData;

    const client = userContext.tx || this.prisma;

    return await client.procurementItem.findMany({
      where: {
        procurement_id: procurementId,
        business_unit_id: userContext.businessUnitId,
      },
    });
  }
  async createProcurementItens(
    procurementItensData: CreateProcurementItemData[],
  ): Promise<ProcurementItem[]> {
    const userContext =
      this.requestContext.getStore() as LocalStorageContextData;

    const client = userContext?.tx || this.prisma;

    const data = procurementItensData.map((pid) => ({
      ...pid,
      created_by: userContext.userId,
      business_unit_id: userContext.businessUnitId,
    }));

    return await client.procurementItem.createMany({
      data,
    });

    // const xprisma = this.prisma.$extends((client) => {
    //   return client.$extends({
    //     query: {
    //       procurement: {
    //         async create({ args, query }) {
    //           let retry = 15;

    //           while (retry > 0) {
    //             try {
    //               let code: string;

    //               const procurementRecord = await client.procurement.findFirst({
    //                 orderBy: {
    //                   id: "desc",
    //                 },
    //                 select: {
    //                   id: true,
    //                   code: true,
    //                 },
    //               });
    //               console.log({ procurementRecord });

    //               if (!procurementRecord) {
    //                 code = "R-00001";
    //               } else {
    //                 const codeNumber = Number(
    //                   procurementRecord.code.split("-")[1],
    //                 );
    //                 if (codeNumber <= 9) {
    //                   code = `R-${"0".repeat(4)}${codeNumber + 1}`;
    //                 } else if (codeNumber <= 99) {
    //                   code = `R-${"0".repeat(3)}${codeNumber + 1}`;
    //                 } else if (codeNumber <= 999) {
    //                   code = `R-${"0".repeat(2)}${codeNumber + 1}`;
    //                 } else if (codeNumber <= 9999) {
    //                   code = `R-${"0".repeat(1)}${codeNumber + 1}`;
    //                 } else {
    //                   code = `R-${codeNumber + 1}`;
    //                 }
    //               }

    //               // 1. Gera o código e injeta nos argumentos antes de salvar
    //               args.data.code = code;
    //               console.log({ args });
    //               // 2. Executa a query original de criação
    //               return await query(args);
    //             } catch (error) {
    //               console.log({ error });
    //               // P2002 é o código do Prisma para erro de Unique Constraint
    //               if (
    //                 error instanceof PrismaClientKnownRequestError &&
    //                 error.code === "P2002"
    //               ) {
    //                 retry--;
    //                 continue;
    //               }
    //               // Se for outro erro, repassa para frente
    //               throw new InternalServerErrorException(
    //                 "Não foi possível gerar um código único.",
    //               );
    //             }
    //           }

    //           throw new Error(
    //             "Não foi possível gerar um código único após várias tentativas.",
    //           );
    //         },
    //       },
    //     },
    //   });
    // });

    // return await xprisma.procurement.create({
    //   data: {
    //     ...procurementData,
    //     business_unit_id: Number(userContext.businessUnitId),
    //     created_by: Number(userContext.userId),
    //   },
    // });
  }
  async deleteProcurementItens(
    procurementItensIds: number[],
  ): Promise<ProcurementItem[]> {
    const userContext =
      this.requestContext.getStore() as LocalStorageContextData;

    const client = userContext?.tx || this.prisma;

    return await client.procurementItem.deleteMany({
      where: {
        id: { in: procurementItensIds },
        business_unit_id: userContext.businessUnitId,
      },
    });
  }
  async updateProcurementItem(procurementItem: UpdateProcurementItemData) {
    const userContext =
      this.requestContext.getStore() as LocalStorageContextData;

    const client = userContext.tx || this.prisma;

    return await client.procurementItem.update({
      where: {
        id: procurementItem.id,
        business_unit_id: userContext.businessUnitId,
      },
      data: {
        quantity: procurementItem.quantity,
        updated_by: userContext.userId,
      },
    });
  }
}
