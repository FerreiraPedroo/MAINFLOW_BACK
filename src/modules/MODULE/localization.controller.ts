import { LocalizationService } from "./localization.service";
import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import type { CreateBlockRequest } from "./types/dto/create-block-request.dto";

@Controller("localizations")
export class Localizationcontroller {
  constructor(private localizationService: LocalizationService) {}

  @Get("blocks")
  async findBlocks() {
    return await this.localizationService.findBlock();
  }
  @Post("blocks")
  async createBlock(@Body() request: CreateBlockRequest) {
    return await this.localizationService.createBlock(request);
  }
  @Put("blocks/:blockId")
  async updateBlocks(
    @Param("blockId") blockId: number,
    @Body("status") blockStatus: string,
  ) {
    return await this.localizationService.updateBlock(blockId, blockStatus);
  }
}
