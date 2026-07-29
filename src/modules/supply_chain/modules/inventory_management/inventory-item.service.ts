import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

import { UnitOfWorkService } from "@/common/infrastructure/unit-of-work/unit-of-work.infrastructure";
import { InventoryItemPrismaRepository } from "./repositories/inventory-item.prisma.repository";

import { GetInventoryItemRecord } from "./types/record/get-inventory-item.record";

import type {
  CreateInventoryItemInput,
  UpdateInventoryItemInput,
} from "./types";

@Injectable()
export class InventoryItemService {
  constructor(
    @Inject("InventoryItemRepository")
    private readonly inventoryItemRepository: InventoryItemPrismaRepository,
    private readonly unitOfWork: UnitOfWorkService,
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

  async getInventory(id: number) {
    let InventoryRecord: GetInventoryItemRecord;
    try {
      InventoryRecord = await this.inventoryItemRepository.getInventoryItem(id);
    } catch (error) {
      this.prismaErrors(error);
    }

    if (!InventoryRecord) {
      throw new UnprocessableEntityException("Requisição não encontrada.");
    }

    return InventoryRecord;
  }
  async findInventoryItems() {
    try {
      return await this.inventoryItemRepository.findInventoryItems();
    } catch (error) {
      this.prismaErrors(error);
    }
  }

  async createInventoryItem(inventoryItemInput: CreateInventoryItemInput) {
    try {
      return this.inventoryItemRepository.createInventoryItem(
        inventoryItemInput,
      );
    } catch (error) {
      this.prismaErrors(error);
    }
  }
  async updateInventory(
    inventoryItemId: number,
    inventoryItemInput: UpdateInventoryItemInput,
  ) {
    try {
      return await this.inventoryItemRepository.updateInventoryItem(
        inventoryItemId,
        inventoryItemInput,
      );
    } catch (error) {
      this.prismaErrors(error);
    }
  }
}
