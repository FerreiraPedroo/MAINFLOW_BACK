import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { Injectable, UnprocessableEntityException } from "@nestjs/common";

import { ContractRepository } from "./repository";

import {
  CreateContractData,
  CreateContractInput,
  FindContractInput,
  UpdateContractData,
  UpdateContractInput,
} from "./types";

@Injectable()
export class ContractService {
  constructor(private contractRepository: ContractRepository) {}

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

  async createContract(contractInput: CreateContractInput) {
    try {
      const contractData = contractInput as CreateContractData;

      return await this.contractRepository.create(contractData);
    } catch (error) {
      return this.prismaErrors(error);
    }
  }
  async findContract(contractQueryInput: FindContractInput) {
    try {
      const { cursor = 1, limit = 20, ...queries } = contractQueryInput;

      return await this.contractRepository.find({
        cursor,
        limit,
        ...queries,
      });
    } catch (error) {
      return this.prismaErrors(error);
    }
  }
  async updateContract(contractId: number, contractInput: UpdateContractInput) {
    try {
      const contractData = contractInput as UpdateContractData;
      return await this.contractRepository.update(contractId, contractData);
    } catch (error) {
      return this.prismaErrors(error);
    }
  }
}
