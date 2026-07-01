import { Controller, Get, Query } from "@nestjs/common";
import { ProcessService } from "./process.service";

@Controller("/process")
export class ProcessController {
  constructor(private processService: ProcessService) {}

  @Get("/models")
  async getProcessModelByBusinessUnit(
    @Query("businessUnitId") businessUnitId: number,
  ) {
    return await this.processService.getProcessModelByBusinessUnitId(
      businessUnitId,
    );
  }
}
