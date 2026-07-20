import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Procurement } from "@prisma/client";

import { PrismaService } from "@/database/prisma/prisma.service";

import { LocalStorageContextService } from "@/common/context/local-storage-context.service";
import { LocalStorageContextData } from "@/common/context/interfaces/local-storage-context.data";
import { CreateProcurementData } from "../types/data/create-procurement.data";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

@Injectable()
export class ProcurementRepository {
  constructor(
    private prisma: PrismaService,
    private requestContext: LocalStorageContextService,
  ) {}

  async findProcurements(): Promise<Procurement[]> {
    const userData = this.requestContext.getStore() as LocalStorageContextData;

    return await this.prisma.procurement.findMany({
      where: { business_unit_id: Number(userData.businessUnitId) },
    });
  }
  async createProcurement(
    procurementData: CreateProcurementData,
  ): Promise<Procurement> {
    const userData = this.requestContext.getStore() as LocalStorageContextData;

    const xprisma = this.prisma.$extends((client) => {
      return client.$extends({
        query: {
          procurement: {
            async create({ args, query }) {
              let retry = 5;

              while (retry > 0) {
                try {
                  let code: string;

                  const procurementRecord = await client.procurement.findFirst({
                    orderBy: {
                      id: "desc",
                    },
                    select: {
                      id: true,
                      code: true,
                    },
                  });

                  console.log({ procurementRecord });
                  if (procurementRecord == null) {
                    code = "R-00001";
                  } else {
                    const codeNumber = Number(
                      procurementRecord.code.split("-")[1],
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
                  console.log({ code });
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
                  throw new InternalServerErrorException(
                    "Não foi possível gerar um código único.",
                  );
                }
              }
              throw new Error(
                "Não foi possível gerar um código único após várias tentativas.",
              );
            },
          },
        },
      });
    });

    return await xprisma.procurement.create({
      data: {
        ...procurementData,
        business_unit_id: Number(userData.businessUnitId),
        created_by: Number(userData.userId),
      },
    });
  }
}
