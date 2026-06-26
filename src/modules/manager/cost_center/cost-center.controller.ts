import { Controller, Get, Query } from "@nestjs/common";

import type { FindCostCenterDto } from "./dto";

import { CostCenterService } from "./cost-center.service";

@Controller()
export class CostCenterController {
  constructor(private costCenterService: CostCenterService) {}

  @Get()
  findCostCenter(@Query() query: FindCostCenterDto) {
    return this.costCenterService.findAll(query);
  }
}
