import { Injectable } from "@nestjs/common";
import { PaymentSubmission } from "@prisma/client";

import { DatabaseService } from "@/common/infrastructure/database/prisma/database.service";

import { CreatePaymentSubmissionData } from "../types/data/create-payment-submission.data";
import { LocalStorageContextService } from "@/common/context/local-storage-context.service";
import { LocalStorageContextData } from "@/common/context/interfaces/local-storage-context.data";

@Injectable()
export class PaymentSubmissionRepository {
  constructor(
    private readonly db: DatabaseService,
    private readonly requestContext: LocalStorageContextService,
  ) {}

  async findById(id: number): Promise<PaymentSubmission | null> {
    return await this.db.client.paymentSubmission.findUnique({
      where: { id },
    });
  }
  async findAll(): Promise<PaymentSubmission[]> {
    return await this.db.client.paymentSubmission.findMany();
  }
  async create(
    paymentSubmissionData: CreatePaymentSubmissionData,
  ): Promise<PaymentSubmission> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.paymentSubmission.create({
      data: {
        ...paymentSubmissionData,
        business_unit_id: Number(requestContext.business_unit_id),
        created_by: Number(requestContext.user_id),
      },
    });
  }
}
