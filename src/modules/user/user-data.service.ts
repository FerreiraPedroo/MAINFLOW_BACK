import { Injectable } from "@nestjs/common";

import { UserDataRepository } from "./repositories/user-data-repository";

import { LocalStorageContextService } from "@/common/context/local-storage-context.service";
import { LocaStorageContextData } from "@/common/context/interfaces/local-storage-context.data";

@Injectable()
export class UserDataService {
  constructor(
    private userDataRepository: UserDataRepository,
    private requestContext: LocalStorageContextService,
  ) {}

  async getUserData(userId: number) {
    return await this.userDataRepository.getUserData(userId);
  }

  async findUserActivitiesByUserId() {
    const userData = this.requestContext.getStore() as LocaStorageContextData;

    const userDepartmentSector =
      await this.userDataRepository.findUserActivitiesByUserId(
        userData.userId,
        userData.businessUnitId,
      );

    return userDepartmentSector;
  }
}
