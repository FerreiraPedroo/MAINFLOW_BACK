import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/exceptions/http-exception.filter";
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ["log", "error", "warn", "debug", "verbose"],
  });
  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
  app.set("query parser", "extended");

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
