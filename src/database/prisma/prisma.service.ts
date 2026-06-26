import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      adapter: new PrismaBetterSqlite3({
        url: "file:./dev.db",
      }),
    });
  }
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: any) {
    process.on("beforeExit", async () => {
      await app.close();
    });
  }
}
