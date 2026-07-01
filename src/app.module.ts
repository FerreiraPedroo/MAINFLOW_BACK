import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { AuthModule } from "@modules/auth/auth.module";
import { PrismaModule } from "@database/prisma/prisma.module";

import { ManagerModule } from "@modules/manager/manager.module";
import { ProcessModule } from "./modules/process/process.module";
import { FacilitiesModule } from "@modules/facilities/facilities.module";

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ManagerModule,
    FacilitiesModule,
    ProcessModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
