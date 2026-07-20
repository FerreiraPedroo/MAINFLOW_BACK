import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

import { ProcurementRepository } from "./repositories/procurement.repository";
import { CreateProcurementRequest } from "./types/dto/create-procurement.request.dto";

@Injectable()
export class ProcurementService {
  constructor(private procurementRepository: ProcurementRepository) {}

  private prismaErrors(error: any): never {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2001": {
          throw new UnprocessableEntityException(
            `O projeto a ser excluído não encontrado.`,
          );
          break;
        }
        case "P2002": {
          const meta = error.meta?.driverAdapterError as any;
          const fields = meta?.cause?.constraint?.fields
            ?.join(" / ")
            .toUpperCase();

          throw new UnprocessableEntityException(
            `Existe um projeto com esses dados: ${fields}`,
          );
          break;
        }
        case "P2025": {
          throw new UnprocessableEntityException(
            "Não foi possivel encontrar um registro necessário para executar a tarefa.",
          );
        }
        default: {
          throw new UnprocessableEntityException(error);
        }
      }
    } else {
      console.log(error);
      throw new UnprocessableEntityException(
        "Não foi possivel executar a ação.",
      );
    }
  }

  async findProcurements() {
    try {
      const procurementRecords =
        await this.procurementRepository.findProcurements();

      return procurementRecords.map((procurement) => ({
        id: procurement.id,
        title: procurement.title,
        type: procurement.type,
        status: procurement.status,
        created: procurement.created_at,
      }));
    } catch (error) {
      this.prismaErrors(error);
    }
  }
  async createProcurement(request: CreateProcurementRequest) {
    const procurementData = {
      code: "",
      title: request.title,
      ...(request.description && { description: request.description }),
      type: request.type,
      status: request.status ?? "RASCUNHO",
      cost_center_id: request.costCenterId,
    };

    try {
      const procurementRecord =
        await this.procurementRepository.createProcurement(procurementData);
    } catch (error) {
      this.prismaErrors(error);
    }
  }
}
