import { Body, Controller, Get, Post, Query } from "@nestjs/common";

import { ValidateService } from "@/common/decorators/validate-service.decorator";

import { PaymentSubmissionService } from "./payment-submission.service";

import {
  CreatePaymentSubmissionInputSchema,
  CreatePaymentSubmissionOutputSchema,
  FindPaymentSubmissionInputSchema,
  FindPaymentSubmissionOutputSchema,
  type CreatePaymentSubmissionRequest,
  type FindPaymentSubmissionInputDto,
} from "./types";

@Controller("backoffice/payment-submissions")
export class PaymentSubmissionController {
  constructor(private paymentSubmissionService: PaymentSubmissionService) {}

  @Get()
  @ValidateService({
    input: FindPaymentSubmissionInputSchema,
    output: FindPaymentSubmissionOutputSchema,
  })
  async findPaymentSubmission(@Query() query: FindPaymentSubmissionInputDto) {
    return await this.paymentSubmissionService.find(query);
  }

  @Post()
  @ValidateService({
    input: CreatePaymentSubmissionInputSchema,
    output: CreatePaymentSubmissionOutputSchema,
  })
  async createPaymentSubmissionion(
    @Body() request: CreatePaymentSubmissionRequest,
  ) {
    return await this.paymentSubmissionService.create(request);
  }
}
