import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { AuthModule } from "@modules/auth/auth.module";
import { PrismaModule } from "@database/prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";

import { UserCacheLoadMiddlware } from "@common/middlewares/user-cache-load.middleware";

import { UserModule } from "@modules/user/user.module";
import { AdminModule } from "@modules/admin/admin.module";
import { ManagerModule } from "@modules/manager/manager.module";
import { ProcessModule } from "@modules/process/process.module";
import { FacilitiesModule } from "@modules/facilities/facilities.module";
import { AlsModule } from "@/common/context/als-context.module";
import { CacheModule } from "@nestjs/cache-manager";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({ isGlobal: true }),
    AlsModule,
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
    consumer.apply(UserCacheLoadMiddlware).exclude("auth/login").forRoutes("*");
  }
}
