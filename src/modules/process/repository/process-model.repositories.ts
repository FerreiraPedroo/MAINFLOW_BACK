import { PrismaService } from "@/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { ProcessModelData } from "../data/process-model.data";
import { CreateProcessModelData } from "../data/create-process-model-data";
import { UpdateProcessModelData } from "../data/update-process-model.data";

@Injectable()
export class ProcessModelRepository {
  constructor(private prisma: PrismaService) {}

  async getProcessModelById(
    processModelId: number,
  ): Promise<ProcessModelData | null> {
    return await this.prisma.processModel.findUnique({
      where: { id: processModelId },
      include: {
        process_item: true,
        process_steps_models: true,
      },
    });
  }
  async findAllProcessModels(): Promise<ProcessModelData[] | null> {
    return await this.prisma.processModel.findMany({
      include: {
        process_item: true,
        process_steps_models: true,
      },
    });
  }
  async createProcessModel(data: CreateProcessModelData) {
    return await this.prisma.processModel.create({
      data: {
        ...data,
      },
    });
  }
  async updateProcessModel(data: UpdateProcessModelData) {
    return this.prisma.processModel.update({
      where: { id: data.id },
      data: {
        ...data,
      },
    });
  }

  // async findProcessModelByProcessItem(processItemId: number) {
  //   return this.prisma.processModel.findFirst({
  //     where: { process_item_id: processItemId },
  //   });
  // }
}
