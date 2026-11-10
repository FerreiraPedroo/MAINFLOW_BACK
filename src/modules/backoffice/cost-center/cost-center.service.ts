import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

import { CostCenterRepository } from "./repositories/cost-center.repository";

import { FindCostCenterDto } from "./types/dto/find-cost-center.dto";
import { CreateCostCenterRequest } from "./types/dto/create-cost-center-request.dto";
import { FindCostCenterResponseDto } from "./types/dto/find-cost-center-response.dto";

@Injectable()
export class CostCenterService {
  constructor(private costCenterRepository: CostCenterRepository) {}

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

  async findAll(
    query: FindCostCenterDto,
  ): Promise<FindCostCenterResponseDto[]> {
    const result = await this.costCenterRepository.findAll();

    const costCenterList = result.map((cost: any) => ({
      id: cost.id,
      title: cost.title,
      status: cost.status,
    }));

    return costCenterList;
  }

  async create(request: CreateCostCenterRequest) {
    try {
      const costCenterRecord = await this.costCenterRepository.create({
        title: request.title,
        status: request.status,
        ...(request.description && { description: request.description }),
      });

      return {
        id: costCenterRecord.id,
        title: costCenterRecord.title,
        status: costCenterRecord.status,
        description: costCenterRecord.description,
      };
    } catch (error) {
      this.prismaErrors(error);
    }
  }
}
