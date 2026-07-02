import { Injectable } from "@nestjs/common";

import { UserRepository } from "./repositories/user.repository";

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUser(email: string) {
    return await this.userRepository.getUser(email);
  }
}
