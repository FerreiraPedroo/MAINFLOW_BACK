import { LocalizationService } from "./localization.service";
import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import type { CreateBlockRequest } from "./types/dto/create-block-request.dto";
import type { CreateFloorRequest } from "./types/dto/create-floor-request.dto";
import type { CreateSpaceTypeRequest } from "./types/dto/create-space-type-request.dto";
import type { CreateAddressRequest } from "./types/dto/create-address-request.dto";
import type { UpdateAddressRequest } from "./types/dto/update-address-request.dto";
import type { CreateLocalizationRequest } from "./types/dto/create-localization-request.dto";

@Controller("localizations")
export class Localizationcontroller {
  constructor(private localizationService: LocalizationService) {}

  ///////////////////////////////////////////////////////////////////////////////
  // LOCALIZATION
  @Get("")
  async findLocalization() {
    return await this.localizationService.findLocalization();
  }
  @Post("")
  async createLocalization(@Body() request: CreateLocalizationRequest) {
    return await this.localizationService.createLocalization(request);
  }
  @Put(":localizationId")
  async updateLocalization(
    @Param("localizationId") localizationId: number,
    @Body() localizationRequest: UpdateLocalizationRequest,
  ) {
    return await this.localizationService.updateLocalization(
      localizationId,
      localizationRequest,
    );
  }

  ///////////////////////////////////////////////////////////////////////////////
  // BLOCKS
  @Get("blocks")
  async findBlocks() {
    return await this.localizationService.findBlocks();
  }
  @Post("blocks")
  async createBlock(@Body() request: CreateBlockRequest) {
    return await this.localizationService.createBlock(request);
  }
  @Put("blocks/:blockId")
  async updateBlock(
    @Param("blockId") blockId: number,
    @Body("status") blockStatus: string,
  ) {
    return await this.localizationService.updateBlock(blockId, blockStatus);
  }

  ///////////////////////////////////////////////////////////////////////////////
  // FLOOR
  @Get("floors")
  async findFloors() {
    return await this.localizationService.findFloors();
  }
  @Post("floors")
  async createFloor(@Body() request: CreateFloorRequest) {
    return await this.localizationService.createFloor(request);
  }
  @Put("floors/:floorId")
  async updateFloor(
    @Param("floorId") floorId: number,
    @Body("status") floorStatus: string,
  ) {
    return await this.localizationService.updateFloor(floorId, floorStatus);
  }

  ///////////////////////////////////////////////////////////////////////////////
  // SPACE-TYPES
  @Get("space-types")
  async findSpaceTypes() {
    return await this.localizationService.findSpaceTypes();
  }
  @Post("space-types")
  async createSpaceType(@Body() request: CreateSpaceTypeRequest) {
    return await this.localizationService.createSpaceType(request);
  }
  @Put("space-types/:spaceTypeId")
  async updateSpaceType(
    @Param("spaceTypeId") spaceTypeId: number,
    @Body("status") spaceTypeStatus: string,
  ) {
    return await this.localizationService.updateSpaceType(
      spaceTypeId,
      spaceTypeStatus,
    );
  }

  ///////////////////////////////////////////////////////////////////////////////
  // SPACE-TYPES
  @Get("address")
  async findAddress() {
    return await this.localizationService.findAddress();
  }
  @Post("address")
  async createAddress(@Body() request: CreateAddressRequest) {
    return await this.localizationService.createAddress(request);
  }
  @Put("address/:addressId")
  async updateAddress(
    @Param("addressId") addressId: number,
    @Body() addressRequest: UpdateAddressRequest,
  ) {
    return await this.localizationService.updateAddress(
      addressId,
      addressRequest,
    );
  }
}
