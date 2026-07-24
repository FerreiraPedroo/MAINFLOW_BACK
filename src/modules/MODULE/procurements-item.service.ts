import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

import { ProcurementItemPrismaRepository } from "./repositories/procurement-item.prisma.repository";

import { CreateProcurementItemRequest } from "./types/dto/create-procurement-item-request.dto";
import { UpdateProcurementItemRequest } from "./types/dto/update-procurement-item-request.dto";
import { FindProcurementItemRecord } from "./types/record/find-procurement-item.record";

@Injectable()
export class ProcurementItemService {
  constructor(
    @Inject("ProcurementItemRepository")
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
      return await this.procurementItemRepository.createProcurementItens(
        procurementItens,
      );
    } catch (error) {
      this.prismaErrors(error);
    }
  }
  async updateProcurementItem(request: UpdateProcurementItemRequest) {
    const procurementItem = {
      id: request.id,
      quantity: request.quantity,
    };

    try {
      return await this.procurementItemRepository.updateProcurementItem(
        procurementItem,
      );
    } catch (error) {
      this.prismaErrors(error);
    }
  }
  async deleteProcurementItens(procurementItemIds: number[]) {
    try {
      return await this.procurementItemRepository.deleteProcurementItens(
        procurementItemIds,
      );
    } catch (error) {
      this.prismaErrors(error);
    }
  }
}
