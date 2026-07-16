import { Body, Controller, Get, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import type { CreateUserRequest } from "./types/dto/create-user-request.dto";

@Controller("/user")
export class UserController {
  constructor(private userService: UserService) {}

  // @Get()
  // async findUserActivitiesByUserId() {
  //   const departmentList =
  //     await this.userDataService.findUserActivitiesByUserId();

  //   return { statusCode: 200, data: departmentList };
  // }
  @Get()
  async getUser() {
    return await this.userService.getUser();
  }
  @Post()
  async createUser(@Body() request: CreateUserRequest) {
    return await this.userService.createUser(request);
  }
}
