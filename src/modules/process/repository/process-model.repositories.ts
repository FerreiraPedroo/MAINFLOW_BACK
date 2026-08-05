import { Injectable } from "@nestjs/common";

import { DatabaseService } from "@/common/infrastructure/database/prisma/database.service";

import { ProcessModelData } from "../data/process-model.data";
import { CreateProcessModelData } from "../data/create-process-model-data";
import { UpdateProcessModelData } from "../data/update-process-model.data";

@Injectable()
export class ProcessModelRepository {
  constructor(private db: DatabaseService) {}

  async getProcessModelById(
    processModelId: number,
  ): Promise<ProcessModelData | null> {
    return await this.db.client.processModel.findUnique({
      where: { id: processModelId },
      include: {
        process_steps_models: true,
      },
    });
  }
  async getProcessModelByProcessCall(
    processCall: string,
  ): Promise<ProcessModelData | null> {
    return await this.db.client.processModel.findUnique({
      where: { process_call: processCall },
      include: {
        process_steps_models: true,
      },
    });
  }
  async findAllProcessModels(): Promise<ProcessModelData[] | null> {
    return await this.db.client.processModel.findMany({
      include: {
        process_steps_models: true,
      },
    });
  }
  async createProcessModel(data: CreateProcessModelData) {
    return await this.db.client.processModel.create({
      data: {
        ...data,
      },
    });
  }
  async updateProcessModel(data: UpdateProcessModelData) {
    return await this.db.client.processModel.update({
      where: { id: data.id },
      data: {
        ...data,
      },
    });
  }

  // async findProcessModelByActivity(activityId: number) {
  //   return this.prisma.processModel.findFirst({
  //     where: { activity_id: activityId },
  //   });
  // }
}
