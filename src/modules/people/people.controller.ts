import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { ValidateService } from "@/common/decorators/validate-service.decorator";
import { uploadFilePipe } from "@/common/pipes/upload-file.pipe";
import { PeopleService } from "./services/people.service";

import type { CreatePeopleRequest } from "./types/dto/create-people-request.dto";
import type { UpdatePeopleRequest } from "./types/dto/update-people-request.dto";
import type {
  CreatePeopleRelationshipFileDto,
  CreatePeopleRelationshipDto,
} from "./types";
import { CreatePeopleRelationshipSchema } from "./types";

@Controller("peoples")
export class Peoplecontroller {
  constructor(private peopleService: PeopleService) {}

  @Get()
  async findPeoples() {
    return await this.peopleService.findPeoples();
  }
  @Get(":peopleId")
  async getPeople(@Param("peopleId") peopleId: number) {
    return await this.peopleService.getPeople(peopleId);
  }
  @Post()
  async createPeople(@Body() request: CreatePeopleRequest) {
    return await this.peopleService.createPeople(request);
  }
  @Put(":peopleId")
  async updatePeoples(
    @Param("peopleId") peopleId: number,
    @Body() request: UpdatePeopleRequest,
  ) {
    return await this.peopleService.updatePeople(peopleId, request);
  }

  //////////////////////////////////////////////////////////////////////
  // PARENTS
  //////////////////////////////////////////////////////////////////////
  @Post("relationship")
  @UseInterceptors(FileInterceptor("photo"))
  @ValidateService({
    input: CreatePeopleRelationshipSchema,
  })
  async createPeopleRelationship(
    @UploadedFile(uploadFilePipe({ fileRequired: false }))
    photo: CreatePeopleRelationshipFileDto,
    @Body() request: CreatePeopleRelationshipDto,
  ) {
    return await this.peopleService.createPeopleRelationship(photo, request);
  }

  @Delete("relationship/:relation_id")
  @ValidateService()
}
