import { Injectable } from "@nestjs/common";

import { DatabaseService } from "@/common/infrastructure/database/prisma/database.service";

@Injectable()
export class ActivityRepository {
  constructor(private readonly db: DatabaseService) {}

  // async getProcessModelById(
  //   processModelId: number,
  // ): Promise<ProcessModelData | null> {
  //   return await this.db.client.processModel.findUnique({
  //     where: { id: processModelId },
  //     include: {
  //       activity: true,
  //       process_steps_models: true,
  //     },
  //   });
  // }
  async findProcessModels(): Promise<any> {
    return await this.db.client.activity.findMany();
  }
  // async createProcessModel(data: CreateProcessModelData) {
  //   return await this.db.client.processModel.create({
  //     data: {
  //       ...data,
  //     },
  //   });
  // }
  // async updateProcessModel(data: UpdateProcessModelData) {
  //   return this.db.client.processModel.update({
  //     where: { id: data.id },
  //     data: {
  //       ...data,
  //     },
  //   });
  // }
}
