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
  CreateProcurementItemsInput,
  UpdateProcurementItemsInput,
} from "./types";
import {
  CreateProcurementItemsInputSchema,
  UpdateProcurementItemsInputSchema,
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

  async findProcurementItems(
    procurementId: number,
  ): Promise<ProcurementItem[]> {
    try {
      return await this.procurementItemRepository.findProcurementItems(
        procurementId,
      );
    } catch (error) {
      this.prismaErrors(error);
    }
  }

  @ValidateService({
    input: CreateProcurementItemsInputSchema,
  })
  async createProcurementItems(
    procurementItemsInput: CreateProcurementItemsInput[],
  ) {
    try {
      return await this.procurementItemRepository.createProcurementItems(
        procurementItemsInput,
      );
    } catch (error) {
      this.prismaErrors(error);
    }
  }

  @ValidateService({
    input: UpdateProcurementItemsInputSchema,
  })
  async updateProcurementItem(
    procurementItemsInput: UpdateProcurementItemsInput,
  ) {
    try {
      return await this.procurementItemRepository.updateProcurementItem(
        procurementItemsInput,
      );
    } catch (error) {
      this.prismaErrors(error);
    }
  }

  async deleteProcurementItems(procurementItemIds: number[]) {
    try {
      return await this.procurementItemRepository.deleteProcurementItems(
        procurementItemIds,
      );
    } catch (error) {
      this.prismaErrors(error);
    }
  }
}
