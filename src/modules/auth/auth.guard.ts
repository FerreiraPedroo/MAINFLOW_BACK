import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { Request } from "express";
import { AuthService } from "./auth.service";
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: string }>();
    const token = request.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new UnauthorizedException(
        "Token inválido, efetue login novamente.",
      );
    }

    try {
      const payload = this.authService.validateToken(token);

      console.log(payload);
      // request["user"] = payload;
      return true;
    } catch {
      throw new UnauthorizedException("Token inválido ou expirado");
    }
    return true;
  }
}
