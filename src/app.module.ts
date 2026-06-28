import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { AuthModule } from "./modules/auth/auth.module";
import { PrismaModule } from "@database/prisma/prisma.module";

import { ManagerModule } from "@modules/manager/manager.module";

@Module({
  imports: [ PrismaModule, ManagerModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
