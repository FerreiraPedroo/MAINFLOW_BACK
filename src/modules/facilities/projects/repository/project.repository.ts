import { PrismaService } from "@/database/prisma/prisma.service.js";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ProjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const result: any = await this.prisma.projects.findAll();
    return result;
  }
}
