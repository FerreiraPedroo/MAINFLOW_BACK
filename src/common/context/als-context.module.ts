import { Module } from "@nestjs/common";
import { AlsContextService } from "./als-context.service";

@Module({
  providers: [AlsContextService],
  exports: [AlsContextService],
})
export class AlsModule {}
