import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ValidateService } from "@/common/decorators/validate-service.decorator";

import type { AuthLoginDto } from "./types";
import { AuthLoginInputSchema, AuthLoginOutputSchema } from "./types";

@Controller("/auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/login")
  @ValidateService({
    input: AuthLoginInputSchema,
    output: AuthLoginOutputSchema,
  })
  async singIn(@Body() request: AuthLoginDto) {
    return await this.authService.signIn(request);
  }
}
