import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller("/user")
export class UserController {
  constructor(private userService: UserService) {}

  @Post("/login")
  async userLogin(@Body() body: { email: string; password: string }) {
    try {
      const userFound = await this.userService.userLogin(
        body.email,
        body.password,
      );

      return { statusCode: 200, data: userFound };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return { statusCode: 500, message: error.message };
      }
      return { statusCode: 500, message: error };
    }
  }
}
