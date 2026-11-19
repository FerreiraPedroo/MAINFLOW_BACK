import { Injectable } from "@nestjs/common";
import { PaymentSubmission } from "@prisma/client";

import { DatabaseService } from "@/common/infrastructure/database/prisma/database.service";

import { LocalStorageContextService } from "@/common/context/local-storage-context.service";
import { LocalStorageContextData } from "@/common/context/interfaces/local-storage-context.data";

import {
  CreatePaymentSubmissionRequest,
  PaymentSubmissionRecord,
} from "./../types";

@Injectable()
export class PaymentSubmissionRepository {
  constructor(
    private readonly db: DatabaseService,
    private readonly requestContext: LocalStorageContextService,
  ) {}

  async getById(id: number): Promise<PaymentSubmission | null> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.paymentSubmission.findUnique({
      where: { id, business_unit_id: requestContext.business_unit_id },
    });
  }

  async find(): Promise<PaymentSubmissionRecord[]> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.paymentSubmission.findMany({
      where: {
        business_unit_id: requestContext.business_unit_id,
      },
      include: {
        business_partner: true,
      },
    });
  }

  async create(
    paymentSubmissionData: CreatePaymentSubmissionRequest,
  ): Promise<PaymentSubmission> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.paymentSubmission.create({
      data: {
        ...paymentSubmissionData,
        business_unit_id: requestContext.business_unit_id,
        created_by: requestContext.user_id,
      },
    });
  }
}
