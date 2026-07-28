import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

import { UnitOfWorkService } from "@/common/infrastructure/unit-of-work/unit-of-work.infrastructure";
import { ProcurementItemService } from "./procurements-item.service";
import { ProcurementPrismaRepository } from "./repositories/procurement.prisma.repository";

import type {
  CreateProcurementInput,
  GetProcurementInput,
  UpdateProcurementInput,
  GetProcurementRecord,
} from "./types";

@Injectable()
export class ProcurementService {
  constructor(
    @Inject("ProcurementRepository")
    private readonly procurementRepository: ProcurementPrismaRepository,
    private readonly procurementItemService: ProcurementItemService,
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

  async getProcurement(id: GetProcurementInput) {
    let procurementRecord: GetProcurementRecord;
    try {
      procurementRecord = await this.procurementRepository.getProcurement(id);
    } catch (error) {
      this.prismaErrors(error);
    }

    if (!procurementRecord) {
      throw new UnprocessableEntityException("Requisição não encontrada.");
    }

    return procurementRecord;
  }
  async findProcurements() {
    try {
      return await this.procurementRepository.findProcurements();
    } catch (error) {
      this.prismaErrors(error);
    }
  }
  async createProcurement(procurementData: CreateProcurementInput) {
    try {
      return await this.procurementRepository.createProcurement(
        procurementData,
      );
    } catch (error) {
      this.prismaErrors(error);
    }
  }
  async updateProcurement(
    procurementId: number,
    request: UpdateProcurementInput,
  ) {
    const procurementData = { ...request };
    delete procurementData.itens;

    const createItens: {
      procurement_id: number;
      item_id: number;
      quantity: number;
    }[] = [];
    const updateItens: { id: number; quantity: number }[] = [];
    const deleteItens: number[] = [];

    try {
      const procurementItensRecords =
        await this.procurementItemService.findProcurementItens(procurementId);

      if (request.itens) {
        procurementItensRecords.forEach((item) => {
          // delete itens
          if (
            !request.itens?.find((reqItem) => reqItem.item_id == item.item_id)
          ) {
            deleteItens.push(item.id);
          }

          // update itens
          const updateItem = request.itens?.find(
            (reqItem) =>
              reqItem.item_id == item.item_id &&
              reqItem.quantity != item.quantity,
          );
          if (updateItem) {
            updateItens.push({
              id: item.id,
              quantity: updateItem.quantity,
            });
          }
        });

        // create new itens
        const itensToCreate = request.itens.filter(
          (reqItem) =>
            !procurementItensRecords.find(
              (procItem) => procItem.item_id == reqItem.item_id,
            ),
        );
        createItens.push(
          ...itensToCreate.map((item) => ({
            procurement_id: procurementId,
            ...item,
          })),
        );
      }

      await this.unitOfWork.runInTransaction(async () => {
        const promises: Promise<any>[] = [
          this.procurementRepository.updateProcurement(
            procurementId,
            procurementData,
          ),
        ];

        if (deleteItens.length) {
          promises.push(
            this.procurementItemService.deleteProcurementItens(deleteItens),
          );
        }
        if (createItens.length) {
          promises.push(
            this.procurementItemService.createProcurementItens(createItens),
          );
        }
        if (updateItens.length) {
          for (const item of updateItens) {
            promises.push(
              await this.procurementItemService.updateProcurementItem({
                ...item,
              }),
            );
          }
        }

        return await Promise.all(promises);
      });

      return true;
    } catch (error) {
      this.prismaErrors(error);
    }
  }
}
