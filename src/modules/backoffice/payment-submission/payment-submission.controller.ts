import { Body, Controller, Get, Post, Query } from "@nestjs/common";

import { PaymentSubmissionService } from "./payment-submission.service";

import { ValidateService } from "@/common/decorators/validate-service.decorator";
import { type FindPaymentSubmissionInputDto, FindPaymentSubmissionInputSchema, FindPaymentSubmissionOutputSchema } from "./types";

@Controller("backoffice/cost-centers")
export class PaymentSubmissionionController {
  constructor(private paymentSubmissionService: PaymentSubmissionService) {}

  @Get()
  @ValidateService({input: FindPaymentSubmissionInputSchema, output: FindPaymentSubmissionOutputSchema})
  async findPaymentSubmission(@Query() query: FindPaymentSubmissionInputDto) {
    return await this.paymentSubmissionService.findAll(query);
  }

  // @Post()
  // async createPaymentSubmissionion(@Body() request: CrePaymentSubmissionrolRequest) {
  //   return await this.paymentSubmissionService.create(request);
  }
}
