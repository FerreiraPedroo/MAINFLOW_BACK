import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ManagerModule } from "@modules/manager/manager.module";
import { PrismaModule } from "@database/prisma/prisma.module";

@Module({
  imports: [PrismaModule, ManagerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
