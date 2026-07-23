import { Request, Response, NextFunction } from "express";
import { Inject, Injectable, NestMiddleware } from "@nestjs/common";

import { JwtService } from "@nestjs/jwt";
import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";

import { LocalStorageContextService } from "../context/local-storage-context.service";
import { LocalStorageContextData } from "../context/interfaces/local-storage-context.data";
// import { UserActivityData } from "@/modules/user/interfaces/data/user-activity.data";

@Injectable()
export class LoadUserCacheMiddlware implements NestMiddleware {
  constructor(
    private requestContext: LocalStorageContextService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // let token: string | undefined;
    // try {
    //   token = req.headers.authorization?.replace("Bearer ", "");

    //   if (!token) {
    //     throw new Error();
    //   }
    // } catch {
    //   throw new UnauthorizedException(
    //     "Você não está logado, efetue o login novamente.",
    //   );
    // }

    // let userPayload: { userId: number; businessId: number };
    const userPayload = { userId: 1, businessId: 1 };

    // try {
    //   const { payload }: { payload: { userId: number; businessId: number } } =
    //     await this.jwtService.verifyAsync(token);

    //   userPayload = payload;
    // } catch {
    //   throw new UnauthorizedException(
    //     "Você foi deslogado, efetue o login novamente.",
    //   );
    // }

    // const userCacheData: UserActivityData[] | undefined =
    //   await this.cacheManager.get(
    //     `userId:${userPayload.userId}:businessId:${userPayload.businessId}`,
    //   );

    // if (!userCacheData) {
    //   throw new UnauthorizedException(
    //     "Dados do usuário não encontrado, efetue o login novamente.",
    //   );
    // }

    // const store: LocalStorageContextData = {
    //   userId: userPayload.userId,
    //   businessUnitId: userPayload.businessId,
    //   userActivities: userCacheData,
    // };

    const store: LocalStorageContextData = {
      userId: 1,
      businessUnitId: 1,
      userActivities: [],
    };

    void this.requestContext.run(store, () => next());
  }
}
