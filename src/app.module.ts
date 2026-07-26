import { UnitOfWork } from "./common/infrastructure/unit-of-work/interfaces/unit-of-work.interface";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { AuthModule } from "@modules/auth/auth.module";
import { PrismaModule } from "@database/prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";

import { FileModule } from "@common/modules/file/file.module";
import { MulterConfigModule } from "@common/modules/multer.module";
import { LoadUserCacheMiddlware } from "@/common/middlewares/load-user-cache.middleware";
import { LocalStorageContextModule } from "@/common/context/local-storage-context.module";

import { UserModule } from "@modules/user/user.module";
import { AdminModule } from "@modules/admin/admin.module";
import { PeopleModule } from "@modules/people/people.module";
import { ManagerModule } from "@modules/manager/manager.module";
import { ProcessModule } from "@modules/process/process.module";
import { FacilitiesModule } from "@modules/facilities/facilities.module";
import { SupplyChainModule } from "@/modules/supply_chain/supply-chain.module";
import { UnitOfWorkModule } from "./common/infrastructure/unit-of-work/unit-of-work.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({ isGlobal: true }),
    LocalStorageContextModule,
    MulterConfigModule,
    PrismaModule,
    UnitOfWorkModule,
    FileModule,
    AdminModule,
    AuthModule,
    FacilitiesModule,
    ManagerModule,
    PeopleModule,
    ProcessModule,
    SupplyChainModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoadUserCacheMiddlware).exclude("auth/login").forRoutes("*");
  }
}
