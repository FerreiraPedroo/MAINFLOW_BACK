import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

export interface JwtPayload {
  user: string;
  businessId: number;
}
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async generateToken(user: string, businessId: number): Promise<string> {
    const token = await this.jwtService.signAsync({
      payload: { user, businessId },
    });

    return token;
  }

  async validateToken(token: string): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch {
      throw new UnauthorizedException({
        codStatus: 401,
        message: "Não foi possivel efetuar o login.",
      });
    }
  }
}
