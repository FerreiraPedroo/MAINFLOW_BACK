import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { AuthModule } from "@modules/auth/auth.module";
import { PrismaModule } from "@database/prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";

import { LoadUserCacheMiddlware } from "@/common/middlewares/load-user-cache.middleware";

import { UserModule } from "@modules/user/user.module";
import { AdminModule } from "@modules/admin/admin.module";
import { ManagerModule } from "@modules/manager/manager.module";
import { ProcessModule } from "@modules/process/process.module";
import { FacilitiesModule } from "@modules/facilities/facilities.module";
import { LocalStorageContextModule } from "@/common/context/local-storage-context.module";
import { CacheModule } from "@nestjs/cache-manager";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({ isGlobal: true }),
    LocalStorageContextModule,
    AuthModule,
    PrismaModule,
    ManagerModule,
    FacilitiesModule,
    ProcessModule,
    AdminModule,
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
