import { Injectable } from "@nestjs/common";

import { LocalStorageContextData } from "@/common/context/interfaces/local-storage-context.data";
import { LocalStorageContextService } from "@/common/context/local-storage-context.service";

import { PrismaService } from "@database/prisma/prisma.service";

import { Address } from "@prisma/client";
import { CreateAddressData } from "../types/data/create-address.data";
import { UpdateAddressData } from "../types/data/update-address.data";

@Injectable()
export class AddressRepository {
  constructor(
    private prisma: PrismaService,
    private requestContext: LocalStorageContextService,
  ) {}

  async findAddress(): Promise<Address[]> {
    const userData = this.requestContext.getStore() as LocalStorageContextData;

    return await this.prisma.address.findMany({
      where: { business_unit_id: Number(userData.businessUnitId) },
    });
  }
  async createAddress(addressData: CreateAddressData): Promise<Address> {
    const userData = this.requestContext.getStore() as LocalStorageContextData;

    return await this.prisma.address.create({
      data: {
        ...addressData,
        business_unit_id: Number(userData.businessUnitId),
      },
    });
  }
  async updateAddress(
    addressId: number,
    addressData: UpdateAddressData,
  ): Promise<Address> {
    const userData = this.requestContext.getStore() as LocalStorageContextData;

    return await this.prisma.address.update({
      where: {
        id: Number(addressId),
        business_unit_id: Number(userData.businessUnitId),
      },
      data: {
        ...addressData,
        updated_by: Number(userData.userId),
      },
    });
  }
}
