import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { jwtConstants } from "./constants/constants";

import { UserModule } from "../user/user.module";

import { AuthController } from "./auth.controller";

import { AuthService } from "./auth.service";
import { EncryptUtil } from "@/common/util/encrypt.util";

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      // signOptions: { expiresIn: "60s" },
    }),
  ],
  controllers: [AuthController],
  providers: [EncryptUtil, AuthService],
})
export class AuthModule {}
