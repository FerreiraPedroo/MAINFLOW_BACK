import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/common/infrastructure/database/prisma/prisma.service";

@Injectable()
export class ActivityRepository {
  constructor(private prisma: PrismaService) {}

  // async getProcessModelById(
  //   processModelId: number,
  // ): Promise<ProcessModelData | null> {
  //   return await this.prisma.processModel.findUnique({
  //     where: { id: processModelId },
  //     include: {
  //       activity: true,
  //       process_steps_models: true,
  //     },
  //   });
  // }
  async findProcessModels(): Promise<any> {
    return await this.prisma.activity.findMany();
  }
  // async createProcessModel(data: CreateProcessModelData) {
  //   return await this.prisma.processModel.create({
  //     data: {
  //       ...data,
  //     },
  //   });
  // }
  // async updateProcessModel(data: UpdateProcessModelData) {
  //   return this.prisma.processModel.update({
  //     where: { id: data.id },
  //     data: {
  //       ...data,
  //     },
  //   });
  // }
}
