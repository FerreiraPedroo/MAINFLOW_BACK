import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";

import { ProcurementService } from "./procurements.service";
import { ValidateService } from "@/common/decorators/validate-service.decorator";

import type {
  CreateProcurementDto,
  GetProcurementDto,
  UpdateProcurementDto,
} from "./types";
import {
  GetProcurementInputSchema,
  GetProcurementOutputSchema,
  CreateProcurementInputSchema,
  CreateProcurementOutputSchema,
  FindProcurementsOutputSchema,
  UpdateProcurementInputSchema,
  UpdateProcurementOutputSchema,
} from "./types";

@Controller("/supply-chain/procurements")
export class ProcurementController {
  constructor(private readonly procurementService: ProcurementService) {}

  @Get(":id")
  @ValidateService({
    input: GetProcurementInputSchema,
    output: GetProcurementOutputSchema,
  })
  async getProcurement(@Param("id") id: GetProcurementDto) {
    return await this.procurementService.getProcurement(id);
  }

  @Get()
  @ValidateService({
    output: FindProcurementsOutputSchema,
  })
  async findProcurement() {
    return await this.procurementService.findProcurements();
  }

  @Post()
  @ValidateService({
    input: CreateProcurementInputSchema,
    output: CreateProcurementOutputSchema,
  })
  async createProcurement(@Body() request: CreateProcurementDto) {
    return await this.procurementService.createProcurement(request);
  }

  @Put(":procurementId")
  @ValidateService({
    input: UpdateProcurementInputSchema,
    output: UpdateProcurementOutputSchema,
  })
  async updateProcurement(
    @Param("procurementId") procurementId: number,
    @Body() request: UpdateProcurementDto,
  ) {
    return await this.procurementService.updateProcurement(
      procurementId,
      request,
    );
  }
}
