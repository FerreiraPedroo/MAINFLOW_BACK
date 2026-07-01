import { UserDataService } from "./user-data.service";
import { Injectable } from "@nestjs/common";
import { HashService } from "@/common/service/hash.service";
import { AuthService } from "@modules/auth/auth.service";

import type { UserLoginResponseDto } from "./dto/user-login.dto";
import { UserRepository } from "./repositories/user.repository";

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private userDataService: UserDataService,
    private hashService: HashService,
    private authService: AuthService,
  ) {}

  async userLogin(
    user: string,
    password: string,
  ): Promise<UserLoginResponseDto> {
    const userFound = await this.userRepository.userLogin(user);
    if (!userFound) {
      throw Error(`{ codStatus: 401, message: "Usuário o senha errados." }`);
    }

    const passwordCompare = await this.hashService.compareHash(
      password,
      userFound.password,
    );

    if (!passwordCompare) {
      throw Error(`{ codStatus: 401, message: "Usuário o senha errados." }`);
    }

    const userInfo = {
      id: userFound.id,
      name: userFound.name,
      photo: userFound.photo,
      email: userFound.email,
    };

    const userDataFound = await this.userDataService.getUserData(userInfo.id);
    if (!userDataFound) {
      throw Error(
        `{ codStatus: 401, message: "Os dados do usuário não foram encontrados." }`,
      );
    }



    const departmentsInfo = { role: "", departments: [] };
    // = {
    //   role: userDataFound.role,
    // };

    const tokenInfo = await this.authService.generateToken(
      userFound.email,
      userFound.business_unit_id,
    );

    return { userInfo, departmentsInfo, tokenInfo };
  }
}
