import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { Injectable, UnprocessableEntityException } from "@nestjs/common";

import { ProjectAllocationRepository } from "./repository";

import {
  CreateAllocatePeopleToInput,
  UpdateAllocateDayProjectInput,
} from "./types";

@Injectable()
export class ProjectAllocationService {
  constructor(
    private projectAllocationRepository: ProjectAllocationRepository,
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

  async allocatePeople(allocateInput: CreateAllocatePeopleToInput) {
    try {
      return await this.projectAllocationRepository.allocatePeople(
        allocateInput,
      );
    } catch (error) {
      this.prismaErrors(error);
    }
  }

  async getAllocationsMonth(projectId: number, year: number, month: number) {
    const startDate = new Date(year, month - 1);
    const endDate = new Date(year, month, 0);

    if (
      startDate.toLocaleString() == "Invalid Date" ||
      endDate.toLocaleString() == "Invalid Date"
    ) {
      throw new UnprocessableEntityException("Data inválida.");
    }

    try {
      return await this.projectAllocationRepository.getAllocationsMonth(
        projectId,
        startDate,
        endDate,
      );
    } catch (error) {
      this.prismaErrors(error);
    }
  }

  async updateAllocateDay(
    allocateId: number,
    allocateInput: UpdateAllocateDayProjectInput,
  ) {
    if (!Object.keys(allocateInput).length) {
      throw new UnprocessableEntityException(
        "Não foi enviado nenhum dado para ser atualizado.",
      );
    }

    try {
      return await this.projectAllocationRepository.updateAllocateDay(
        allocateId,
        allocateInput,
      );
    } catch (error) {
      this.prismaErrors(error);
    }
  }

  async deleteAlocallocateDay(allocateId: number) {
    try {
      return await this.projectAllocationRepository.deleteAlocallocateDay(
        allocateId,
      );
    } catch (error) {
      this.prismaErrors(error);
    }
  }
  ////////////////////////////////////////////////////////////////////////////////
}
