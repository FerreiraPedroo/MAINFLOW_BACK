import { CostCenterRepository } from "./repositories/cost-center.repository";
import { Injectable } from "@nestjs/common";
import { FindCostCenterDto, FindCostCenterResponseDto } from "./dto";

import { CreateCostCenterDto } from "./dto/create-cost-center.dto";

@Injectable()
export class CostCenterService {
  constructor(private costCenterRepository: CostCenterRepository) {}

  async findAll(
    query: FindCostCenterDto,
  ): Promise<FindCostCenterResponseDto[]> {
    const result = await this.costCenterRepository.findAll();

    const costCenterList = result.map((cost) => ({
      id: cost.id,
      title: cost.title,
      status: cost.status,
    }));

    return costCenterList;
  }

  async create(body: CreateCostCenterDto) {
    return await this.costCenterRepository.create({
      title: body.title,
      status: body.status,
      description: body.description ?? null,
      business_unit_id: 1,
    });
  }
}
