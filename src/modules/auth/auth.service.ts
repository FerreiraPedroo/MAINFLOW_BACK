import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async generateToken(payload: { user: string; businessId: number }) {
    const token = await this.jwtService.signAsync(
      {
        payload: `${payload.user}:${payload.businessId}`,
      },
      {
        secret: "SECRET",
        // expiresIn: "7D",
      },
    );

    return token;
  }

  async validateToken(token: string) {
    try {
      const tokenValid = await this.jwtService.verifyAsync(token);
    } catch {
      throw new UnauthorizedException({
        codStatus: 401,
        message: "Não foi possivel efetuar o login.",
      });
    }

    return token;
  }
}
