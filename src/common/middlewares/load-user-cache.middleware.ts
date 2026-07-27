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

    // let userPayload: { user_id: number; business_unit_id: number };
    const userPayload = { user_id: 1, business_unit_id: 1 };

    // try {
    //   const { payload }: { payload: { user_id: number; business_unit_id: number } } =
    //     await this.jwtService.verifyAsync(token);

    //   userPayload = payload;
    // } catch {
    //   throw new UnauthorizedException(
    //     "Você foi deslogado, efetue o login novamente.",
    //   );
    // }

    // const userCacheData: UserActivityData[] | undefined =
    //   await this.cacheManager.get(
    //     `user_id:${userPayload.user_id}:business_unit_id:${userPayload.business_unit_id}`,
    //   );

    // if (!userCacheData) {
    //   throw new UnauthorizedException(
    //     "Dados do usuário não encontrado, efetue o login novamente.",
    //   );
    // }

    // const store: LocalStorageContextData = {
    //   user_id: userPayload.user_id,
    //   business_unit_id: userPayload.business_unit_id,
    //   userActivities: userCacheData,
    // };

    const store: LocalStorageContextData = {
      user_id: 1,
      business_unit_id: 1,
      userActivities: [],
    };

    void this.requestContext.run(store, () => next());
  }
}
