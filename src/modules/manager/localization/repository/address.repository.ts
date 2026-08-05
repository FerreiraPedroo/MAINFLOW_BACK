import { Injectable } from "@nestjs/common";

import { LocalStorageContextData } from "@/common/context/interfaces/local-storage-context.data";
import { LocalStorageContextService } from "@/common/context/local-storage-context.service";

import { DatabaseService } from "@/common/infrastructure/database/prisma/database.service";

import { Address } from "@prisma/client";
import { CreateAddressData } from "../types/data/create-address.data";
import { UpdateAddressData } from "../types/data/update-address.data";

@Injectable()
export class AddressRepository {
  constructor(
    private db: DatabaseService,
    private requestContext: LocalStorageContextService,
  ) {}

  async findAddress(): Promise<Address[]> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.address.findMany({
      where: { business_unit_id: Number(requestContext.business_unit_id) },
    });
  }
  async createAddress(addressData: CreateAddressData): Promise<Address> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.address.create({
      data: {
        ...addressData,
        business_unit_id: Number(requestContext.business_unit_id),
      },
    });
  }
  async updateAddress(
    addressId: number,
    addressData: UpdateAddressData,
  ): Promise<Address> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.address.update({
      where: {
        id: Number(addressId),
        business_unit_id: Number(requestContext.business_unit_id),
      },
      data: {
        ...addressData,
        updated_by: Number(requestContext.user_id),
      },
    });
  }
}
