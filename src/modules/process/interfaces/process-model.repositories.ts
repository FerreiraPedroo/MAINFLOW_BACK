import { PrismaService } from "@/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { ProcessModelData } from "../data/process-model.data";
import { CreateProcessModelData } from "../data/create-process-model-data";

@Injectable()
export class ProcessModelRepository {
  constructor(private prisma: PrismaService) {}

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
}
