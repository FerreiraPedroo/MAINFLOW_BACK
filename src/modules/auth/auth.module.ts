import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { jwtConstants } from "./constants/constants";

import { AuthController } from "./auth.controller";

import { AuthService } from "./auth.service";
import { EncryptService } from "@/common/service/encrypt.service";
import { UserModule } from "../user/user.module";
import { DepartmentModule } from "../manager/department/department.module";

@Module({
  imports: [
    UserModule,
    DepartmentModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      // signOptions: { expiresIn: "60s" },
    }),
  ],
  controllers: [AuthController],
  providers: [EncryptService, AuthService],
})
export class AuthModule {}
