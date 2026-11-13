import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

import { PaymentSubmissionRepository } from "./repositories/payment-submission.repository";
import { FindPaymentSubmissionResponseDto, type FindPaymentSubmissionInputDto } from "./types";

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

  async findAll(
    query: FindPaymentSubmissionInputDto,
  ): Promise<FindPaymentSubmissionResponseDto[]> {

    const queryBuild = 


    const result = await this.paymentSubmissionRepository.findAll();

    const paymentSubmissionList = result.map((payment: any) => ({
      id: payment.id,
      invoice_number: payment.invoice_number,
      invoice_type: payment.invoice_type,
      due_date: payment.due_date,
      total_amount: payment.total_amount,
    }));

    return paymentSubmissionList;
  }

  // async create(request: CreatePaymentSubmissionionRequest) {
  //   try {
  //     const paymentSubmissionionionionionRecord =paypaypaypaypaymentSubmissionionionionionionymentControlRepository.create({
  //       title: request.title,
  //       status: request.status,
  //       ...(request.description && { description: request.description }),
  //     });

  //     return {
  //       id: paymentSubmissionionionionionRecord.id,
  //       title: paymentSubmissionRecord.title,
  //       status: paymentSubmissionRecord.status,
  //       description: paymentSubmissionRecord.description,
  //     };
  //   } catch (error) {
  //     this.prismaErrors(error);
  //   }
  // }
}
