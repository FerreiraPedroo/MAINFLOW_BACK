import { FileInterceptor } from "@nestjs/platform-express";
import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";

import type { Express } from "express";

import { UserService } from "./user.service";
import { uploadFilePipe } from "@/common/pipes/upload-file.pipe";
import { ValidateService } from "@/common/decorators/validate-service.decorator";

import type { CreateUserRequest } from "./types/dto/create-user-request.dto";

import {
  CreateUserInputSchema,
  CreateUserOutputSchema,
  GetUsersOutputSchema,
} from "./types/schema";

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
    photo: Express.Multer.File,
    @Body() request: CreateUserRequest,
  ) {
    return await this.userService.createUser(photo, request);
  }
}
