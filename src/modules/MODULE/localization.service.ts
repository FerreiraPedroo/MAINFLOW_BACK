import { BlockRepository } from "./repository/block.repository";
import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { CreateBlockRequest } from "./types/dto/create-block-request.dto";

@Injectable()
export class LocalizationService {
  constructor(private blockRepository: BlockRepository) {}

  private prismaErrors(error: any): never {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2001": {
          throw new UnprocessableEntityException(
            `O bloco a ser excluído não encontrado.`,
          );
          break;
        }
        case "P2002": {
          const meta = error.meta?.driverAdapterError as any;
          const fields = meta?.cause?.constraint?.fields
            ?.join(" / ")
            .toUpperCase();

          throw new UnprocessableEntityException(
            `Existe um blocko com esses dados: ${fields}`,
          );
          break;
        }
        case "P2025": {
          throw new UnprocessableEntityException(
            "Não foi possivel encontrar um registro necessário para executar a tarefa.",
          );
        }
        default: {
          console.log(error);
          throw new UnprocessableEntityException(error.message);
        }
      }
    } else {
      console.log(error);
      throw new UnprocessableEntityException(
        "Não foi possivel executar a ação.",
      );
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  // BLOCK
  async findBlock() {
    try {
      const blockRecords = await this.blockRepository.findBlock();

      return blockRecords.map((block) => ({
        id: block.id,
        title: block.title,
        status: block.status,
      }));
    } catch (error) {
      this.prismaErrors(error);
    }
  }
  async createBlock(request: CreateBlockRequest) {
    const blockData = {
      title: request.title,
      status: request.status,
    };

    try {
      const blockRecord = await this.blockRepository.createBlock(blockData);

      return {
        id: blockRecord.id,
        title: blockRecord.title,
        status: blockRecord.status,
      };
    } catch (error) {
      this.prismaErrors(error);
    }
  }
  async updateBlock(blockId: number, blockStatus: string) {
    try {
      const blockRecord = await this.blockRepository.updateBlock(
        blockId,
        blockStatus,
      );

      return {
        id: blockRecord.id,
        title: blockRecord.title,
        status: blockRecord.status,
      };
    } catch (error) {
      this.prismaErrors(error);
    }
  }
}
