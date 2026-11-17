import { Module } from "@nestjs/common";

import { EncryptUtil } from "@/common/utils/encrypt.util";
import { LocalStorageContextModule } from "@/common/context/local-storage-context.module";

import { UserController } from "./user.controller";

import { UserService } from "./user.service";
import { UserActivityService } from "./user-activity.service";

import { UserActivityRepository, UserRepository } from "./repositories";

@Module({
  imports: [LocalStorageContextModule],
  controllers: [UserController],
  providers: [
    EncryptUtil,
    UserService,
    UserRepository,
    UserActivityService,
    UserActivityRepository,
  ],
  exports: [UserService, UserActivityService],
})
export class UserModule {}
