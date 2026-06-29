import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/database/prisma/prisma.service";

import { Project } from "@prisma/client";
import { ProjectComplete } from "../interfaces/project-complete.type";

@Injectable()
export class ProjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: number): Promise<ProjectComplete | null> {
    return await this.prisma.project.findUnique({
      where: { id },
      include: {
        cost_center: true,
      },
    });
  }

  async findAll(): Promise<Project[] | null> {
    return await this.prisma.project.findMany();
  }
}
