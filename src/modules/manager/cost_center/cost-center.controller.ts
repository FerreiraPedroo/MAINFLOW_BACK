import { Body, Controller, Get, Post, Query } from "@nestjs/common";

import type { FindCostCenterDto } from "./dto";

import { CostCenterService } from "./cost-center.service";
import type { CreateCostCenterDto } from "./dto/create-cost-center.dto";

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
  async createCostCenter(@Body() body: CreateCostCenterDto) {
    try {
      const costCenterCreated = await this.costCenterService.create(body);
      return { codStatus: 200, data: costCenterCreated };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { codStatus: 500, message: error.message };
      }
      return { codStatus: 500, message: "Erro do servidor." };
    }
  }
}
