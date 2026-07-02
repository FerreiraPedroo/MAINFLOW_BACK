import { Module } from "@nestjs/common";
import { RequestContextService } from "./request-als.service";

@Module({
  providers: [RequestContextService],
  exports: [RequestContextService],
})
export class AlsModule {}
