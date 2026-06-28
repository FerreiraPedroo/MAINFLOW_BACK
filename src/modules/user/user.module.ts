import { Module } from "@nestjs/common";

import { HashService } from "@/common/service/hash.service";

import { UserController } from "./user.controller";

import { UserService } from "./user.service";
import { UserDataService } from "./user-data.service";

import { UserRepository } from "./repositories/user.repository";
import { UserDataRepository } from "./repositories/user-data-repository";

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    HashService,
    UserService,
    UserDataService,
    UserRepository,
    UserDataRepository,
  ],
})
export class UserModule {}
