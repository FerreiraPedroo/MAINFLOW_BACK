import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

import { PaymentSubmissionRepository } from "./repositories/payment-submission.repository";
import {
  CreatePaymentSubmissionRequest,
  FindPaymentSubmissionOutputDto,
  type FindPaymentSubmissionInputDto,
} from "./types";

@Injectable()
export class PaymentSubmissionService {
  constructor(
    private paymentSubmissionRepository: PaymentSubmissionRepository,
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

  async find(
    query: FindPaymentSubmissionInputDto,
  ): Promise<FindPaymentSubmissionOutputDto> {
    return await this.paymentSubmissionRepository.find();
  }

  async create(request: CreatePaymentSubmissionRequest) {
    try {
      return await this.paymentSubmissionRepository.create(request);
    } catch (error) {
      this.prismaErrors(error);
    }
  }
}
