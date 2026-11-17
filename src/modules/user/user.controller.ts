import { FileInterceptor } from "@nestjs/platform-express";
import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";

import { uploadFilePipe } from "@/common/pipes/upload-file.pipe";
import { ValidateService } from "@/common/decorators/validate-service.decorator";

import { UserService } from "./user.service";

import type { CreateUserDto, CreateUserFileDto } from "./types";
import {
  CreateUserInputSchema,
  CreateUserOutputSchema,
  GetUsersOutputSchema,
} from "./types";

@Controller("/users")
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ValidateService({ output: GetUsersOutputSchema })
  async getUsers() {
    return await this.userService.getUsers();
  }

  @Post()
  @UseInterceptors(FileInterceptor("photo"))
  @ValidateService({
    input: CreateUserInputSchema,
    output: CreateUserOutputSchema,
  })
  async createUser(
    @UploadedFile(
      uploadFilePipe({
        fileType: "img",
        fileSize: 5100000,
        fileRequired: false,
      }),
    )
    photo: CreateUserFileDto,
    @Body() request: CreateUserDto,
  ) {
    return await this.userService.createUser(photo, request);
  }
}
