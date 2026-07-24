import { ProcurementRepository } from "./types/interfaces/procurement.repository.interface";
import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

import { ProcurementPrismaRepository } from "./repositories/procurement.prisma.repository";

import { GetProcurementRecord } from "./types/record/get-procurement.record";
import { UpdateProcurementData } from "./types/data/update-procurement.data";
import { UpdateProcurementRequest } from "./types/dto/procurement.request.dto";
import { CreateProcurementRequest } from "./types/dto/create-procurement.request.dto";
import { ProcurementItemService } from "./procurements-item.service";

import { PrismaUnitOfWork } from "@/common/infrastructure/unit-of-work/unit-of-work.infrastructure";

@Injectable()
export class ProcurementService {
  constructor(
    @Inject("ProcurementRepository")
    private readonly procurementRepository: ProcurementPrismaRepository,
    private readonly procurementItemService: ProcurementItemService,
    private readonly unitOfWork: PrismaUnitOfWork,
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

  async getProcurement(procurementId: number) {
    let procurementRecord: GetProcurementRecord;
    try {
      procurementRecord =
        await this.procurementRepository.getProcurement(procurementId);
    } catch (error) {
      this.prismaErrors(error);
    }

    if (!procurementRecord) {
      throw new UnprocessableEntityException("Requisição não encontrada.");
    }

    return {
      id: procurementRecord.id,
      code: procurementRecord.code,
      title: procurementRecord.title,
      description: procurementRecord.description,
      type: procurementRecord.type,
      status: procurementRecord.status,
      sendDate: procurementRecord.send_date,
      costCenter: {
        id: procurementRecord.cost_center.id,
        title: procurementRecord.cost_center.title,
        status: procurementRecord.cost_center.status,
        description: procurementRecord.cost_center.description,
      },
      items: procurementRecord.items.map((item) => ({
        id: item.id,
        title: item.item.title,
        itemId: item.item.id,
        code: item.item.code,
        quantity: item.quantity,
        unit_measure: item.item.unit_measure,
        category: item.item.category,
        subCategory: item.item.sub_category,
        type: item.item.type,
        description: item.item.description,
        imagePath: item.item.image_path,
        hsCode: item.item.hs_code,
        manufacturer: item.item.manufacturer && {
          id: item.item.manufacturer.id,
          manufacturerLegalName: item.item.manufacturer.legal_name,
          manufacturerTaxNumber: item.item.manufacturer.tax_number,
          manufacturePartNumber: item.item.manufacturer_part_number,
          manufacturerCatalog: item.item.manufacturer_catalog,
          manufacturerDataSheet: item.item.manufacturer_data_sheet,
          manufacturerImagePath: item.item.manufacturer_image_path,
        },
      })),
    };
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

      return {
        id: procurementRecord.id,
        title: procurementRecord.title,
        description: procurementRecord.description,
        type: procurementRecord.type,
        status: procurementRecord.status,
        costCenterId: procurementRecord.cost_center_id,
      };
    } catch (error) {
      this.prismaErrors(error);
    }
  }
  async updateProcurement(
    procurementId: number,
    request: UpdateProcurementRequest,
  ) {
    const procurementData: UpdateProcurementData = {
      ...(request.title && { title: request.title }),
      ...(request.description && { description: request.description }),
      ...(request.type && { type: request.type }),
      ...(request.status && { status: request.status }),
      ...(request.costCenterId && { cost_center_id: request.costCenterId }),
    };
    const createItens = [];
    const updateItens: { id: number; quantity: number }[] = [];
    const deleteItens: number[] = [];

    try {
      const procurementItensRecords =
        await this.procurementItemService.findProcurementItens(procurementId);

      if (request.itens) {
        procurementItensRecords.forEach((item) => {
          // delete itens
          if (!request.itens?.find((ri) => ri.itemId == item.itemId)) {
            deleteItens.push(item.id);
          }

          // update itens
          const updateItem = request.itens?.find(
            (ri) => ri.itemId == item.itemId && ri.quantity != item.quantity,
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
          (ri) => !procurementItensRecords.find((pi) => pi.itemId == ri.itemId),
        );
        createItens.push(
          ...itensToCreate.map((i) => ({
            itemId: i.itemId,
            quantity: i.quantity,
          })),
        );
      }

      const result = await this.unitOfWork.runInTransaction(async () => {
        return Promise.all([
          this.procurementRepository.updateProcurement(
            procurementId,
            procurementData,
          ),
          deleteItens.length &&
            this.procurementItemService.deleteProcurementItens(deleteItens),
          updateItens.length &&
            ...updateItens.map((ui) =>
              this.procurementItemService.updateProcurementItem(ui),
            ),
          deleteItens &&
            this.procurementItemService.deleteProcurementItens(deleteItens),
        ]);
      });
    } catch (error) {
      this.prismaErrors(error);
    }
  }
}
