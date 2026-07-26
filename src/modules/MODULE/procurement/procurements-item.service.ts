import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { ProcurementItem } from "@prisma/client";

import { ValidateService } from "@/common/decorators/validate-service.decorator";

import { ProcurementItemPrismaRepository } from "./repositories/procurement-item.prisma.repository";

import type {
  CreateProcurementItensInput,
  UpdateProcurementItensInput,
} from "./types";
import {
  CreateProcurementItensInputSchema,
  UpdateProcurementItensInputSchema,
} from "./types";

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
  ): Promise<ProcurementItem[]> {
    try {
      return await this.procurementItemRepository.findProcurementItens(
        procurementId,
      );
    } catch (error) {
      this.prismaErrors(error);
    }
  }

  @ValidateService({
    input: CreateProcurementItensInputSchema,
  })
  async createProcurementItens(
    procurementItensInput: CreateProcurementItensInput[],
  ) {
    try {
      return await this.procurementItemRepository.createProcurementItens(
        procurementItensInput,
      );
    } catch (error) {
      this.prismaErrors(error);
    }
  }

  @ValidateService({
    input: UpdateProcurementItensInputSchema,
  })
  async updateProcurementItem(
    procurementItensInput: UpdateProcurementItensInput,
  ) {
    try {
      return await this.procurementItemRepository.updateProcurementItem(
        procurementItensInput,
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
