import { Injectable } from "@nestjs/common";
import { FindCostCenterDto } from "./dto";
import { PrismaService } from "@/database/prisma/prisma.service";

@Injectable()
export class CostCenterService {
  constructor(private prisma: PrismaService) {}

  findAll(query: FindCostCenterDto): string {
    return JSON.stringify(query);
  }
}
