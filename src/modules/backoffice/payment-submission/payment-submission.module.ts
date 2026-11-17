import { Module } from "@nestjs/common";

import { LocalStorageContextModule } from "@/common/context/local-storage-context.module";

import { PaymentSubmissionService } from "./payment-submission.service";

import { PaymentSubmissionRepository } from "./repositories/payment-submission.repository";
import { PaymentSubmissionController } from "./payment-submission.controller";

@Module({
  imports: [LocalStorageContextModule],
  controllers: [PaymentSubmissionController],
  providers: [PaymentSubmissionService, PaymentSubmissionRepository],
  exports: [PaymentSubmissionRepository],
})
export class PaymentSubmissionModule {}
