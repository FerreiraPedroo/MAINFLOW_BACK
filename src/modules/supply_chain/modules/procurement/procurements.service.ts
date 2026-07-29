import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

import { ProjectService } from "@/modules/facilities/projects/project.service";

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
    private readonly projectService: ProjectService,
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
  async createProcurement(procurementInput: CreateProcurementInput) {
    // SE FOR ASSOCIADO A UM PROJETO, PEGAR O CENTRO DE CUSTO E ASSOCIAR A PROCUREMENT.
    if (procurementInput.project_id) {
      const projectRecord = await this.projectService.getProjectById(
        procurementInput.project_id,
      );

      if (!projectRecord) {
        throw new UnprocessableEntityException("Projeto não encontrado.");
      }

      procurementInput.cost_center_id = projectRecord.cost_center_id;
    } else if (!procurementInput.cost_center_id) {
      // DEVE SER OBRIGATÓRIO O CENTRO DE CUSTO, SE NÃO TIVER PROJETO ASSOCIADO.
      throw new UnprocessableEntityException(
        "Centro de custo não selecionado.",
      );
    }

    try {
      return await this.procurementRepository.createProcurement(
        procurementInput,
      );
    } catch (error) {
      this.prismaErrors(error);
    }
  }
  async updateProcurement(
    procurementId: number,
    procurementInput: UpdateProcurementInput,
  ) {
    const procurementData = { ...procurementInput };
    delete procurementData.items;

    // SE FOR ASSOCIADO A UM PROJETO, PEGAR O CENTRO DE CUSTO E ASSOCIAR A PROCUREMENT.
    if (procurementData.project_id) {
      const projectRecord = await this.projectService.getProjectById(
        procurementData.project_id,
      );

      if (!projectRecord) {
        throw new UnprocessableEntityException("Projeto não encontrado.");
      }

      procurementData.cost_center_id = projectRecord.cost_center_id;
    } else if (!procurementData.cost_center_id) {
      // DEVE SER OBRIGATÓRIO O CENTRO DE CUSTO, SE NÃO TIVER PROJETO ASSOCIADO.
      throw new UnprocessableEntityException(
        "Centro de custo não selecionado.",
      );
    }

    const createItems: {
      procurement_id: number;
      item_id: number;
      quantity: number;
    }[] = [];
    const updateItems: { id: number; quantity: number }[] = [];
    const deleteItems: number[] = [];

    try {
      const procurementItemsRecords =
        await this.procurementItemService.findProcurementItems(procurementId);

      if (procurementInput.items) {
        procurementItemsRecords.forEach((item) => {
          // delete items
          if (
            !procurementInput.items?.find(
              (reqItem) => reqItem.item_id == item.item_id,
            )
          ) {
            deleteItems.push(item.id);
          }

          // update items
          const updateItem = procurementInput.items?.find(
            (reqItem) =>
              reqItem.item_id == item.item_id &&
              reqItem.quantity != item.quantity,
          );
          if (updateItem) {
            updateItems.push({
              id: item.id,
              quantity: updateItem.quantity,
            });
          }
        });

        // create new items
        const itemsToCreate = procurementInput.items.filter(
          (reqItem) =>
            !procurementItemsRecords.find(
              (procItem) => procItem.item_id == reqItem.item_id,
            ),
        );
        createItems.push(
          ...itemsToCreate.map((item) => ({
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

        if (deleteItems.length) {
          promises.push(
            this.procurementItemService.deleteProcurementItems(deleteItems),
          );
        }
        if (createItems.length) {
          promises.push(
            this.procurementItemService.createProcurementItems(createItems),
          );
        }
        if (updateItems.length) {
          for (const item of updateItems) {
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
