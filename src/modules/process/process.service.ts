import { Injectable } from "@nestjs/common";
import { ProcessModelRepository } from "./interfaces/process-model.repositories";

@Injectable()
export class ProcessService {
  constructor(private processModelRepository: ProcessModelRepository) {}

  async getProcessModelByBusinessUnitId(businessUnitId: number) {
    return await this.processModelRepository.getProcessModelByBusinessUnitId(
      businessUnitId,
    );
  }
}
