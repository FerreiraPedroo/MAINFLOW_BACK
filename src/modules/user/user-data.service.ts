import { Injectable } from "@nestjs/common";
import { UserDataRepository } from "./repositories/user-data-repository";

@Injectable()
export class UserDataService {
  constructor(private userDataRepository: UserDataRepository) {}

  async getUserData(userId: number) {
    return await this.userDataRepository.getUserData(userId);

    
  }
}
