import { Controller, Get } from "@nestjs/common";
import { UserDataService } from "./user-data.service";

@Controller("/user")
export class UserController {
  constructor(private userDataService: UserDataService) {}

  @Get()
  async findUserActivitiesByUserId() {
    const departmentList =
      await this.userDataService.findUserActivitiesByUserId();

    return { statusCode: 200, data: departmentList };
  }
}
