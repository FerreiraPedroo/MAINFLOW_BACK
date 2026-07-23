import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

import { ProcurementItemPrismaRepository } from "./repositories/procurement-item.prisma.repository";

import { CreateProcurementItemRequest } from "./types/dto/create-procurement-item-request.dto";
import { UpdateProcurementItemRequest } from "./types/dto/update-procurement-item-request.dto";
import { FindProcurementItemRecord } from "./types/record/find-procurement-item.record";

@Injectable()
export class ProcurementItemService {
  constructor(
    private readonly procurementItemRepository: ProcurementItemPrismaRepository,
  ) {}

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

  async findProcurementItens(
    procurementId: number,
  ): Promise<FindProcurementItemRecord[]> {
    const procurementItensRecord =
      await this.procurementItemRepository.findProcurementItens(procurementId);

    return procurementItensRecord.map((pi) => ({
      id: pi.id,
      procurementId: pi.procurement_id,
      itemId: pi.item_id,
      quantity: pi.quantity,
    }));
  }
  async createProcurementItens(
    procurementItensRequest: CreateProcurementItemRequest[],
  ) {
    const procurementItens = procurementItensRequest.map((pi) => ({
      procurement_id: pi.procurementId,
      item_id: pi.itemId,
      quantity: pi.quantity,
    }));

    try {
      const procurementItensRecords =
        await this.procurementItemRepository.createProcurementItens(
          procurementItens,
        );

      return procurementItensRecords.map((pir) => ({
        id: pir.id,
        quantity: pir.quantity,
        itemId: pir.item_id,
        procurementId: pir.procurement_id,
      }));
    } catch (error) {
      this.prismaErrors(error);
    }
  }
  async updateProcurementItem(
    procurementItemId: number,
    request: UpdateProcurementItemRequest,
  ) {
    const procurementItem = {
      quantity: request.quantity,
    };

    try {
      return await this.procurementItemRepository.updateProcurementItem(
        procurementItemId,
        procurementItem,
      );
    } catch (error) {
      this.prismaErrors(error);
    }
  }
}
