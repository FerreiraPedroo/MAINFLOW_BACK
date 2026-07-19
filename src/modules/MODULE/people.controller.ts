import { PeopleService } from "./people.service";
import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import type { CreatePeopleRequest } from "./types/dto/create-people-request.dto";

@Controller("peoples")
export class Peoplecontroller {
  constructor(private peopleService: PeopleService) {}

  // @Get("peoples")
  // async findPeoples() {
  //   return await this.peopleService.findPeople();
  // }
  // @Post("peoples")
  // async createPeople(@Body() request: CreatePeopleRequest) {
  //   return await this.peopleService.createPeople(request);
  // }
  // @Put("peoples/:peopleId")
  // async updatePeoples(
  //   @Param("peopleId") peopleId: number,
  //   @Body("status") peopleStatus: string,
  // ) {
  //   return await this.peopleService.updatePeople(peopleId, peopleStatus);
  // }
}
