import { PrismaService } from "@/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { GetProcessStepModelData } from "../data/get-process-step-model.data";
import { CreateProcessStepModelData } from "../data/create-process-step-model.data";
import { ProcessStepModel } from "@prisma/client";

@Injectable()
export class ProcessStepModelRepository {
  constructor(private prisma: PrismaService) {}

  async createProcessStepModel(
    processStepModelData: CreateProcessStepModelData,
  ): Promise<ProcessStepModel> {
    return await this.prisma.processStepModel.create({
      data: {
        ...processStepModelData,
      },
    });
  }
  async getProcessStepModelById(
    processStepModelId: number,
  ): Promise<GetProcessStepModelData | null> {
    return await this.prisma.processStepModel.findUnique({
      where: { id: Number(processStepModelId) },
    });
  }
}
