import { Module } from "@nestjs/common";

import { LocalStorageContextModule } from "@/common/context/local-storage-context.module";
import { EncryptService } from "@/common/service/encrypt.service";

import { UserController } from "./user.controller";

import { UserService } from "./user.service";

import { UserRepository } from "./repositories/user.repository";
import { UserActivityRepository } from "./repositories/user-activity-repository";

@Module({
  imports: [LocalStorageContextModule],
  controllers: [UserController],
  providers: [
    EncryptService,
    UserService,
    UserRepository,
    UserActivityRepository,
  ],
  exports: [UserService, UserRepository, UserActivityRepository],
})
export class UserModule {}
