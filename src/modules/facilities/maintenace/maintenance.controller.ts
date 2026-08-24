import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";

import { FileInterceptor } from "@nestjs/platform-express";

import { MaintenanceService } from "./maintenance.service";
import { uploadFilePipe } from "@/common/pipes/upload-file.pipe";
import { ValidateService } from "@/common/decorators/validate-service.decorator";

import {
  FindMaintenanceInputSchema,
  FindMaintenanceOutputSchema,
} from "./types";
import type { CreateMaintenanceDto, CreateMaintenanceFileDto } from "./types";

@Controller("facilities/maintenance")
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Get()
  @ValidateService({
    input: FindMaintenanceInputSchema,
    output: FindMaintenanceOutputSchema,
  })
  async getMaintenance(
    @Query("year") year: number,
    @Query("month") month: number,
    @Query("week") week: number,
  ) {
    return await this.maintenanceService.findMaintenance({
      year,
      month,
      week,
    });
  }

  @Post()
  @UseInterceptors(FileInterceptor("photo"))
  @ValidateService({})
  async createMaintenance(
    @UploadedFile(uploadFilePipe({ fileRequired: false }))
    photo: CreateMaintenanceFileDto,
    @Body() request: CreateMaintenanceDto,
  ) {
    return await this.maintenanceService.createMaintenance(photo, request);
  }
}
