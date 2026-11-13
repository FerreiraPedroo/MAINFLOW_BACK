import { Module } from "@nestjs/common";

import { LocalStorageContextModule } from "@/common/context/local-storage-context.module";

import { PaymentSubmissionService } from "./payment-submission.service";

import { PaymentSubmissionionionRepository } from "./repositories/payment-submission.repository";
import { PaymentSubmissionionionController } from "./payment-submission.controller";

@Module({
  imports: [LocalStorageContextModule],
  controllers: [PaymentSubmissionionionController],
  providers: [PaymentSubmissionionionSerPayPaymentSubmissionontrolRepository],
  exports: [PaymentSubmissionRepository],
})
export class PaymentSubmissionModule {}
