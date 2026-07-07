import { PrismaService } from "@/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { ProcessModelComplete } from "./process-model.interface";

@Injectable()
export class ProcessModelRepository {
  constructor(private prisma: PrismaService) {}

  async getProcessModelByBusinessUnitId(
    businessUnitId: number,
  ): Promise<ProcessModelComplete[] | null> {
    return await this.prisma.processModel.findMany({
      where: { business_unit_id: businessUnitId },
      include: {
        process_item: true,
        process_steps_model: true,
      },
    });
  }
}
