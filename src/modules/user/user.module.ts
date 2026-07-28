import { Module } from "@nestjs/common";

import { EncryptService } from "@/common/service/encrypt.service";
import { UnitOfWorkModule } from "@/common/infrastructure/unit-of-work/unit-of-work.module";
import { LocalStorageContextModule } from "@/common/context/local-storage-context.module";

import { UserController } from "./user.controller";

import { UserService } from "./user.service";
import { UserActivityService } from "./user-activity.service";

import { UserActivityRepository, UserRepository } from "./repositories";

@Module({
  imports: [LocalStorageContextModule, UnitOfWorkModule],
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
