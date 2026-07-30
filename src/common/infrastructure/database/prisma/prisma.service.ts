import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
// import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  // public readonly prismaInstance: PrismaClient;

  constructor() {
    super({
      adapter: new PrismaBetterSqlite3({ url: "file:./dev.db" }),
      // adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
    });
    // this.prismaInstance = new PrismaClient({
    //   adapter: new PrismaBetterSqlite3({ url: "file:./dev.db" }),
    //   // adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
    // });
  }

  async onModuleInit() {
    await this.$connect();
    // await this.prismaInstance.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
    // await this.prismaInstance.$disconnect();
  }
}
