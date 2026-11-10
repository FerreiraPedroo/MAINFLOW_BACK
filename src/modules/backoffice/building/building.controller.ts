import { BuildingService } from "./building.service";
import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import {
  FindBuildingOutputSchema,
  GetBuildingInputSchema,
  GetBuildingOutputSchema,
  type CreateBuildingRequest,
  type UpdateBuildingRequest,
} from "./types";
import { ValidateService } from "@/common/decorators/validate-service.decorator";

@Controller("buildings")
export class Buildingcontroller {
  constructor(private buildingService: BuildingService) {}

  ///////////////////////////////////////////////////////////////////////////////
  //
  @Get("")
  @ValidateService({ output: FindBuildingOutputSchema })
  async findBuilding() {
    return await this.buildingService.findBuilding();
  }

  @Get(":buildingId")
  @ValidateService({
    input: GetBuildingInputSchema,
    output: GetBuildingOutputSchema,
  })
  async getBuilding(@Param("buildingId") buildingId: number) {
    return await this.buildingService.getBuilding(buildingId);
  }

  @Post("")
  async createBuilding(@Body() request: CreateBuildingRequest) {
    return await this.buildingService.createBuilding(request);
  }

  @Put(":buildingId")
  async updateBuilding(
    @Param("buildingId") buildingId: number,
    @Body() buildingRequest: UpdateBuildingRequest,
  ) {
    return await this.buildingService.updateBuilding(
      buildingId,
      buildingRequest,
    );
  }
}
