import { PrismaService } from "@/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DepartmentRepository {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    return await this.prismaService.department.findMany();
  }
}
