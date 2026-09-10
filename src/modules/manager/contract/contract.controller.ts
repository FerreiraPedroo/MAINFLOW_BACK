import { ContractService } from "./contract.service";
import { ValidateService } from "@/common/decorators/validate-service.decorator";
import { Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common";
import {
  type CreateContractInputDto,
  type FindContractInputDto,
  type UpdateContractInputDto,
  CreateContractInputSchema,
  CreateContractOutputSchema,
  FindContractInputSchema,
  FindContractOutputSchema,
  UpdateContractInputSchema,
  UpdateContractOutputSchema,
} from "./types";

@Controller("contracts")
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post()
  @ValidateService({
    input: CreateContractInputSchema,
    output: CreateContractOutputSchema,
  })
  async createContract(@Body() request: CreateContractInputDto) {
    return await this.contractService.createContract(request);
  }

  @Get()
  @ValidateService({
    input: FindContractInputSchema,
    output: FindContractOutputSchema,
  })
  async findContract(@Query() queries: FindContractInputDto) {
    return await this.contractService.findContract(queries);
  }

  @Put(":id")
  @ValidateService({
    input: UpdateContractInputSchema,
    output: UpdateContractOutputSchema,
  })
  async updateContract(
    @Param("id") contractId: number,
    @Body() request: UpdateContractInputDto,
  ) {
    return await this.contractService.updateContract(contractId, request);
  }
}
