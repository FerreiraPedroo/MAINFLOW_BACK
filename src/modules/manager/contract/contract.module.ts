import { Module } from "@nestjs/common";

import { LocalStorageContextModule } from "@/common/context";

import { ContractService } from "./contract.service";
import { ContractController } from "./contract.controller";
import { ContractRepository } from "./repository/contract.repository";

@Module({
  imports: [LocalStorageContextModule],
  controllers: [ContractController],
  providers: [ContractService, ContractController, ContractRepository],
  exports: [ContractController],
})
export class ContractModule {}
