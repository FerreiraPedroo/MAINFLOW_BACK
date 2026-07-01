import { Module } from "@nestjs/common";

import { EncryptService } from "@/common/service/encrypt.service";

import { UserController } from "./user.controller";

import { UserService } from "./user.service";
import { UserDataService } from "./user-data.service";

import { UserRepository } from "./repositories/user.repository";
import { UserDataRepository } from "./repositories/user-data-repository";

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    EncryptService,
    UserService,
    UserDataService,
    UserRepository,
    UserDataRepository,
  ],
  exports: [UserService],
})
export class UserModule {}
