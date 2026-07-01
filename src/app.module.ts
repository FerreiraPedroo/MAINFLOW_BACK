import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { AuthModule } from "@modules/auth/auth.module";
import { PrismaModule } from "@database/prisma/prisma.module";

import { AdminModule } from "@modules/admin/admin.module";
import { ManagerModule } from "@modules/manager/manager.module";
import { ProcessModule } from "./modules/process/process.module";
import { FacilitiesModule } from "@modules/facilities/facilities.module";
import { UserModule } from "./modules/user/user.module";

@Module({
  imports: [
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
export class AppModule {}
