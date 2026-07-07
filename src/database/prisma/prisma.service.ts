import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
// import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      adapter: new PrismaBetterSqlite3({ url: "file:./dev.db" }),
      // adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
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

// @Injectable()
// export class PrismaService extends PrismaClient implements OnModuleInit {
//   constructor() {
//     super({
//       adapter: new PrismaBetterSqlite3({ url: "file:./dev.db" }),
//       // adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
//     });
//   }
//   async onModuleInit() {
//     await this.$connect();
//   }

//   async enableShutdownHooks(app: any) {
//     process.on("beforeExit", async () => {
//       await app.close();
//     });
//   }
// }
