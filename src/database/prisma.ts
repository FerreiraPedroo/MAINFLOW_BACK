import { PrismaClient } from '#/prisma/generated/client.js';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
const adapter = new PrismaBetterSqlite3({
  url: 'file:./dev.db',
});

export const prisma: PrismaClient = new PrismaClient({
  adapter,
});
