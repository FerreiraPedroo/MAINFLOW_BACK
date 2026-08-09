import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { LocalStorageContextService } from "@/common/context/local-storage-context.service";
import { Prisma, PrismaClient } from "@prisma/client";

type DbClient = Prisma.TransactionClient | PrismaClient;

@Injectable()
export class DatabaseService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly requestContext: LocalStorageContextService,
  ) {}

  get client(): DbClient {
    return (
      this.requestContext.getStore()?.tx ?? this.prismaService.prismaInstance
    );
  }

  async transaction<T>(work: () => Promise<T>): Promise<T> {
    const store = this.requestContext.getStore();

    if (store?.tx) {
      return work();
    }

    return this.prismaService.prismaInstance.$transaction(async (tx) => {
      if (store) {
        store.tx = tx;
      }

      try {
        return await work();
      } finally {
        if (store) {
          delete store.tx;
        }
      }
    });
  }
}
