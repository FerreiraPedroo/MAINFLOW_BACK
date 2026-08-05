import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

import { InventoryItemRepository } from "./repositories/inventory-item.repository";

import { GetInventoryItemRecord } from "./types/record/get-inventory-item.record";

import type {
  CreateInventoryItemInput,
  UpdateInventoryItemInput,
} from "./types";
import { DatabaseService } from "@/common/infrastructure/database/prisma/database.service";

@Injectable()
export class InventoryItemService {
  constructor(
    private readonly inventoryItemRepository: InventoryItemRepository,
    private readonly db: DatabaseService,
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

  async getInventoryItem(id: number) {
    let inventoryRecord: GetInventoryItemRecord;
    try {
      inventoryRecord = await this.inventoryItemRepository.getInventoryItem(id);
    } catch (error) {
      this.prismaErrors(error);
    }

    if (!inventoryRecord) {
      throw new UnprocessableEntityException("Requisição não encontrada.");
    }

    return inventoryRecord;
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
