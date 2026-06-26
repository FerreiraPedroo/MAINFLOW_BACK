import { Controller, Get, Post, Query } from "@nestjs/common";

import type { FindCostCenterDto, FindCostCenterResponseDto } from "./dto";

import { CostCenterService } from "./cost-center.service";

@Controller("/manager/cost-center")
export class CostCenterController {
  constructor(private costCenterService: CostCenterService) {}

  @Get()
  async findCostCenter(
    @Query() query: FindCostCenterDto,
  ): Promise<FindCostCenterResponseDto[]> {
    const costCenter = await this.costCenterService.findAll(query);

    const costCenterList = costCenter.map((cost) => ({
      id: cost.id,
      title: cost.title,
    }));

    return costCenterList;
  }

  @Post()
  async createCostCenter(@Body() body: CreateCostCenterDto){
    
  }
}
