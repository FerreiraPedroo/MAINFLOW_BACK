import { Module } from "@nestjs/common";
import { ContractModule } from "./contract";
import { BuildingModule } from "./building/building.module";
import { CostCenterModule } from "./cost-center/cost-center.module";
import { LocalizationModule } from "./localization/localization.module";
import { PaymentSubmissionModule } from "./payment-control/payment-submission.module";

@Module({
  imports: [
    ContractModule,
    CostCenterModule,
    BuildingModule,
    LocalizationModule,
    PaymentSubmissionModule,
  ],
  exports: [
    ContractModule,
    CostCenterModule,
    BuildingModule,
    LocalizationModule,
    PaymentSubmissionModule,
  ],
})
export class BackOfficeModule {}
