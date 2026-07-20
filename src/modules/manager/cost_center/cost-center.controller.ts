import { Body, Controller, Get, Post, Query } from "@nestjs/common";

import { CostCenterService } from "./cost-center.service";

import type { FindCostCenterDto } from "./types/dto/find-cost-center.dto";
import type { CreateCostCenterRequest } from "./types/dto/create-cost-center-request.dto";

@Controller("/manager/cost-center")
export class CostCenterController {
  constructor(private costCenterService: CostCenterService) {}

  @Get()
  async findCostCenter(@Query() query: FindCostCenterDto) {
    try {
      const costCenterList = await this.costCenterService.findAll(query);

      return { codStatus: 200, data: costCenterList };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { codStatus: 500, message: error.message };
      }
      return { codStatus: 500, message: "Erro do servidor." };
    }
  }

  @Post()
  async createCostCenter(@Body() request: CreateCostCenterRequest) {
    return await this.costCenterService.create(request);
  }
}
