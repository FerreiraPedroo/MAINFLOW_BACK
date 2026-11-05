import { LocalizationService } from "./localization.service";
import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";

import { ValidateService } from "@/common/decorators/validate-service.decorator";

import {
  GetLocalizationByBuildingIdOutputSchema,
  GetLocalizationByBuildingIdInputSchema,
  CreateRoomInputSchema,
  CreateRoomOutputSchema,
  type CreateFloorRequest,
  type CreateSpaceTypeRequest,
  type CreateBlockRequest,
  type CreateLocalizationRequest,
  type UpdateLocalizationRequest,
  type CreateRoomInputDto,
} from "./types";

@Controller("localizations")
export class Localizationcontroller {
  constructor(private localizationService: LocalizationService) {}

  ///////////////////////////////////////////////////////////////////////////////
  // LOCALIZATION
  ///////////////////////////////////////////////////////////////////////////////
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
  ///////////////////////////////////////////////////////////////////////////////
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
  ///////////////////////////////////////////////////////////////////////////////
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
  // ROOM
  ///////////////////////////////////////////////////////////////////////////////
  @Get("roms")
  async findRooms() {
    return await this.localizationService.findRooms();
  }
  @Post("rooms")
  @ValidateService({
    input: CreateRoomInputSchema,
    output: CreateRoomOutputSchema,
  })
  async createRoom(@Body() request: CreateRoomInputDto) {
    return await this.localizationService.createRoom(request);
  }
  @Put("rooms/:roomId")
  async updateRoom(
    @Param("roomId") roomId: number,
    @Body("status") roomStatus: string,
  ) {
    return await this.localizationService.updateRoom(roomId, roomStatus);
  }

  ///////////////////////////////////////////////////////////////////////////////
  // SPACE-TYPES
  ///////////////////////////////////////////////////////////////////////////////
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
  // LOCALIZATIONS BY BUILDING ID
  ///////////////////////////////////////////////////////////////////////////////
  @Get("buildings/:buildingId")
  @ValidateService({
    input: GetLocalizationByBuildingIdInputSchema,
    output: GetLocalizationByBuildingIdOutputSchema,
  })
  async getLocalizationsByBuildingId(@Param("buildingId") buildingId: number) {
    const r =
      await this.localizationService.getLocalizationsByBuildingId(buildingId);
    console.log(r);

    return r;
  }
}
