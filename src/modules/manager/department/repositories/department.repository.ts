import { PrismaService } from "@/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DepartmentRepository {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.department.findMany();
  }
}
