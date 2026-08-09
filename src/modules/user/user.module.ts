import { Module } from "@nestjs/common";

import { EncryptService } from "@/common/service/encrypt.service";
import { LocalStorageContextModule } from "@/common/context/local-storage-context.module";

import { UserController } from "./user.controller";

import { UserService } from "./user.service";
import { UserActivityService } from "./user-activity.service";

import {
  UserActivityRepository,
  UserRepository,
} from "./infrastructure/repositories";

@Module({
  imports: [LocalStorageContextModule],
  controllers: [UserController],
  providers: [
    EncryptService,
    UserService,
    UserRepository,
    UserActivityService,
    UserActivityRepository,
  ],
  exports: [UserService, UserActivityService],
})
export class UserModule {}
