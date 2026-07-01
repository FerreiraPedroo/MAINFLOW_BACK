import { Injectable } from "@nestjs/common";
import { AdminRepository } from "./repositories/admin.repository";

@Injectable()
export class AdminService {
  constructor(private adminRepository: AdminRepository) {}

  async findBusinessUnitById(id: number) {
    return await this.adminRepository.findBusinessUnitById(id);
  }
}
