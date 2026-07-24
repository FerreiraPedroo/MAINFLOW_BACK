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

import type { CreateUserRequest } from "./types/dto/create-user-request.dto";
import { uploadFilePipe } from "@/common/pipes/upload-file.pipe";

@Controller("/users")
export class UserController {
  constructor(private userService: UserService) {}

  // @Get()
  // async findUserActivitiesByUserId() {
  //   const departmentList =
  //     await this.userContextService.findUserActivitiesByUserId();

  //   return { statusCode: 200, data: departmentList };
  // }

  @Post()
  @UseInterceptors(FileInterceptor("photo"))
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
  @Get()
  async getUsers() {
    return await this.userService.getUsers();
  }
}
