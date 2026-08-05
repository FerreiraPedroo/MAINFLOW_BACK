import { Injectable } from "@nestjs/common";
import { ProcessStepModel } from "@prisma/client";

import { DatabaseService } from "@common/infrastructure/database/prisma/database.service";

import { GetProcessStepModelData } from "../data/get-process-step-model.data";
import { CreateProcessStepModelData } from "../data/create-process-step-model.data";

@Injectable()
export class ProcessStepModelRepository {
  constructor(private readonly db: DatabaseService) {}

  async createProcessStepModel(
    processStepModelData: CreateProcessStepModelData,
  ): Promise<ProcessStepModel> {
    return await this.db.client.processStepModel.create({
      data: {
        ...processStepModelData,
      },
    });
  }
  async getProcessStepModelById(
    processStepModelId: number,
  ): Promise<GetProcessStepModelData | null> {
    return await this.db.client.processStepModel.findUnique({
      where: { id: Number(processStepModelId) },
    });
  }
}
