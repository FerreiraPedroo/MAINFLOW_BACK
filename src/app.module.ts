import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { AuthModule } from "@modules/auth/auth.module";
import { PrismaModule } from "@database/prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";

import { MulterConfigModule } from "@common/modules/multer.module";
import { LocalStorageContextModule } from "@/common/context/local-storage-context.module";
import { LoadUserCacheMiddlware } from "@/common/middlewares/load-user-cache.middleware";

import { UserModule } from "@modules/user/user.module";
import { AdminModule } from "@modules/admin/admin.module";
import { ManagerModule } from "@modules/manager/manager.module";
import { ProcessModule } from "@modules/process/process.module";
import { FacilitiesModule } from "@modules/facilities/facilities.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({ isGlobal: true }),
    MulterConfigModule,
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
