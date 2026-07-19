import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";

import { PeopleService } from "./people.service";

import type { CreatePeopleRequest } from "./types/dto/create-people-request.dto";
import type { UpdatePeopleRequest } from "./types/dto/update-people-request.dto";

@Controller("peoples")
export class Peoplecontroller {
  constructor(private peopleService: PeopleService) {}

  @Get()
  async findPeoples() {
    return await this.peopleService.findPeoples();
  }
  @Get(":peopleId")
  async findPeople(@Param("peopleId") peopleId: number) {
    return await this.peopleService.findPeople(peopleId);
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
}
