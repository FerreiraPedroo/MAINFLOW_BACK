import { Injectable } from "@nestjs/common";

import { FindProjectDto } from "@modules/facilities/projects/dto/index.js";
import { PrismaClient } from "@prisma/generated/client.js";

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaClient) {}

  getProject(id: number): string {
    return "";
  }
  async findProject(query: FindProjectDto): string {
    const result = await this.prisma.findProject(query);
    return "";
  }
}
