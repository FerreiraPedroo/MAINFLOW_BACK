import { Request, Response, NextFunction } from "express";
import {
  Inject,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from "@nestjs/common";

import { JwtService } from "@nestjs/jwt";

import type { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

import { RequestContextService } from "../context/request-als.service";

@Injectable()
export class UserCacheLoadMiddlware implements NestMiddleware {
  constructor(
    private requestContext: RequestContextService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    let token: string | undefined;
    try {
      token = req.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        throw new Error();
      }
    } catch {
      throw new UnauthorizedException(
        "Você não está logado, efetue o login novamente.",
      );
    }

    let userPayload: { userId: number; businessId: number };
    try {
      const { payload }: { payload: { userId: number; businessId: number } } =
        await this.jwtService.verifyAsync(token);

      userPayload = payload;
    } catch {
      throw new UnauthorizedException(
        "Você foi deslogado, efetue o login novamente.",
      );
    }

    const userCacheData = await this.cacheManager.get(
      `userId:${userPayload.userId}:businessId:${userPayload.businessId}`,
    );

    if (!userCacheData) {
      throw new UnauthorizedException(
        "Dados do usuário não encontrado, efetue o login novamente.",
      );
    }

    const store = {
      userId: userPayload.userId,
      businessUnitId: userPayload.businessId,
      userData: userCacheData,
    };

    this.requestContext.run(store, () => next());
  }
}
