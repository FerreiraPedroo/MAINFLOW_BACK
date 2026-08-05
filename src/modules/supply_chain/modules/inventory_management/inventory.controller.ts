import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";

import { InventoryItemService } from "./inventory-item.service";

import { ValidateService } from "@/common/decorators/validate-service.decorator";

import type { CreateInventoryItemDto, UpdateInventoryItemDto } from "./types";
import {
  FindInventoryItemsOutputSchema,
  GetInventoryItemInputSchema,
  GetInventoryItemOutputSchema,
  CreateInventoryItemInputSchema,
  CreateInventoryItemOutputSchema,
  UpdateInventoryItemInputSchema,
  UpdateInventoryItemOutputSchema,
} from "./types";

@Controller("/supply-chain/inventory-items")
export class InventoryController {
  constructor(private readonly inventoryItemService: InventoryItemService) {}

  @Get()
  @ValidateService({
    output: FindInventoryItemsOutputSchema,
  })
  async findInventoryItems() {
    return await this.inventoryItemService.findInventoryItems();
  }

  @Get(":id")
  @ValidateService({
    input: GetInventoryItemInputSchema,
    output: GetInventoryItemOutputSchema,
  })
  async getInventoryItem(@Param("id") id: number) {
    return await this.inventoryItemService.getInventoryItem(id);
  }

  @Post()
  @ValidateService({
    input: CreateInventoryItemInputSchema,
    output: CreateInventoryItemOutputSchema,
  })
  async createInventoryItem(@Body() request: CreateInventoryItemDto) {
    return await this.inventoryItemService.createInventoryItem(request);
  }

  @Put(":id")
  @ValidateService({
    input: UpdateInventoryItemInputSchema,
    output: UpdateInventoryItemOutputSchema,
  })
  async updateInventoryItem(
    @Param("id") id: number,
    @Body() request: UpdateInventoryItemDto,
  ) {
    return await this.inventoryItemService.updateInventory(id, request);
  }
}
