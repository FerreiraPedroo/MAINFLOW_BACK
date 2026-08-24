import { Body, Controller, Get, Post, Query } from "@nestjs/common";

import { CostCenterService } from "./cost-center.service";

import type { FindCostCenterDto } from "./types/dto/find-cost-center.dto";
import type { CreateCostCenterRequest } from "./types/dto/create-cost-center-request.dto";

@Controller("/manager/cost-centers")
export class CostCenterController {
  constructor(private costCenterService: CostCenterService) {}

  @Get()
  async findCostCenter(@Query() query: FindCostCenterDto) {
    return await this.costCenterService.findAll(query);
  }

  @Post()
  async createCostCenter(@Body() request: CreateCostCenterRequest) {
    return await this.costCenterService.create(request);
  }
}
