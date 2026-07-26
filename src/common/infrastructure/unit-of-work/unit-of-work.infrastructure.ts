import { PrismaService } from "@/database/prisma/prisma.service";
import { LocalStorageContextService } from "../../context/local-storage-context.service";
import { UnitOfWork } from "./interfaces/unit-of-work.interface";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaUnitOfWork implements UnitOfWork {
  constructor(
    private readonly prisma: PrismaService,
    private readonly requestContext: LocalStorageContextService,
  ) {}

  async runInTransaction<T>(work: () => Promise<T>): Promise<T> {
    return await this.prisma.$transaction(async (tx) => {
      const store = this.requestContext.getStore();

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
