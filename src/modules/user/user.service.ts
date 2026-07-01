import { Injectable } from "@nestjs/common";

import { UserRepository } from "./repositories/user.repository";

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUser(user: string) {
    return await this.userRepository.getUser(user);
  }
}
