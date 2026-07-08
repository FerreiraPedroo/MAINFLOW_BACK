import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/database/prisma/prisma.service";

@Injectable()
export class ProcessModelRepository {
  constructor(private readonly prisma: PrismaService) {}

  getProcessModelByBusinessUnitId(): string {
    return "";
  }
}
