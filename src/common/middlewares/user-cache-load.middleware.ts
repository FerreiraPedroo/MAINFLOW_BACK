import { PrismaService } from "@/database/prisma/prisma.service";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class UserCacheLoadMiddlware implements NestMiddleware {
  constructor(private prismaService: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const result = await this.prismaService.user.findMany();
    console.log({ result });
    next();
  }
}
