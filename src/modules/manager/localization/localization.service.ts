import { LocalizationRepository } from "./repository/localization.repository";
import { AddressRepository } from "./repository/address.repository";
import { SpaceTypeRepository } from "./repository/space-type.repository";
import { FloorRepository } from "./repository/floor.repository";
import { BlockRepository } from "./repository/block.repository";
import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { CreateBlockRequest } from "./types/dto/create-block-request.dto";
import { CreateFloorRequest } from "./types/dto/create-floor-request.dto";
import { CreateSpaceTypeRequest } from "./types/dto/create-space-type-request.dto";
import { CreateAddressRequest } from "./types/dto/create-address-request.dto";
import { UpdateAddressRequest } from "./types/dto/update-address-request.dto";
import { CreateLocalizationRequest } from "./types/dto/create-localization-request.dto";
import { UpdateLocalizationRequest } from "./types/dto/update-localization-request.dto";

@Injectable()
export class LocalizationService {
  constructor(
    private blockRepository: BlockRepository,
    private floorRepository: FloorRepository,
    private spaceTypeRepository: SpaceTypeRepository,
    private addressRepository: AddressRepository,
    private localizationRepository: LocalizationRepository,
  ) {}

  private prismaErrors(error: any): never {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2001": {
          throw new UnprocessableEntityException(
            `O bloco a ser excluído não encontrado.`,
          );
          break;
        }
        case "P2002": {
          const meta = error.meta?.driverAdapterError as any;
          const fields = meta?.cause?.constraint?.fields
            ?.join(" / ")
            .toUpperCase();

          throw new UnprocessableEntityException(
            `Existe um block com esses dados: ${fields}`,
          );
          break;
        }
        case "P2025": {
          throw new UnprocessableEntityException(
            "Não foi possivel encontrar um registro necessário para executar a tarefa.",
          );
        }
        default: {
          console.log(error);
          throw new UnprocessableEntityException(error.message);
        }
      }
    } else {
      console.log(error);
      throw new UnprocessableEntityException(
        "Não foi possivel executar a ação.",
      );
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  // LOCALIZATION
  async findLocalization() {
    try {
      const localizationRecords =
        await this.localizationRepository.findLocalizations();

      return localizationRecords.map((localization) => ({
        id: localization.id,
        title: localization.title,
        block: localization.block.title,
        floor: localization.floor.title,
        spaceType: localization.space_type.title,
        address: localization.address.short_address,
      }));
    } catch (error) {
      this.prismaErrors(error);
    }
  }
  async createLocalization(request: CreateLocalizationRequest) {
    const localizationData = {
      title: request.title,
      block_id: Number(request.blockId),
      floor_id: Number(request.floorId),
      space_type_id: Number(request.spaceTypeId),
      address_id: Number(request.addressId),
      status: request.status,
    };

    try {
      const localizationRecord =
        await this.localizationRepository.createLocalization(localizationData);

      return {
        id: localizationRecord.id,
        block: localizationRecord.block.title,
        floor: localizationRecord.floor.title,
        spaceType: localizationRecord.space_type.title,
        address: localizationRecord.address.short_address,
      };
    } catch (error) {
      this.prismaErrors(error);
    }
  }
  async updateLocalization(
    localizationId: number,
    request: UpdateLocalizationRequest,
  ) {
    const localizationData = {
      ...(request.title && { title: request.title }),
      ...(request.blockId && { block_id: request.blockId }),
      ...(request.floorId && { floor_id: request.floorId }),
      ...(request.spaceTypeId && { space_type_id: request.spaceTypeId }),
      ...(request.addressId && { address_id: request.addressId }),
      ...(request.status && { status: request.status.toUpperCase() }),
    };

    try {
      const localizationRecord =
        await this.localizationRepository.updateLocalization(
          localizationId,
          localizationData,
        );

      return {
        id: localizationRecord.id,
        title: localizationRecord.title,
        block: localizationRecord.block.title,
        floor: localizationRecord.floor.title,
        spaceType: localizationRecord.space_type.title,
        address: localizationRecord.address.short_address,
      };
    } catch (error) {
      this.prismaErrors(error);
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  // BLOCK
  async findBlocks() {
    try {
      const blockRecords = await this.blockRepository.findBlocks();

      return blockRecords.map((block) => ({
        id: block.id,
        title: block.title,
        status: block.status,
      }));
    } catch (error) {
      this.prismaErrors(error);
    }
  }
  async createBlock(request: CreateBlockRequest) {
    const blockData = {
      title: request.title,
      status: request.status,
    };

    try {
      const blockRecord = await this.blockRepository.createBlock(blockData);

      return {
        id: blockRecord.id,
        title: blockRecord.title,
        status: blockRecord.status,
      };
    } catch (error) {
      this.prismaErrors(error);
    }
  }
  async updateBlock(blockId: number, blockStatus: string) {
    try {
      const blockRecord = await this.blockRepository.updateBlock(
        blockId,
        blockStatus,
      );

      return {
        id: blockRecord.id,
        title: blockRecord.title,
        status: blockRecord.status,
      };
    } catch (error) {
      this.prismaErrors(error);
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  // FlOOR
  async findFloors() {
    try {
      const floorRecords = await this.floorRepository.findFloor();

      return floorRecords.map((floor) => ({
        id: floor.id,
        title: floor.title,
        status: floor.status,
      }));
    } catch (error) {
      this.prismaErrors(error);
    }
  }
  async createFloor(request: CreateFloorRequest) {
    const floorData = {
      title: request.title,
      status: request.status,
    };

    try {
      const floorRecord = await this.floorRepository.createFloor(floorData);

      return {
        id: floorRecord.id,
        title: floorRecord.title,
        status: floorRecord.status,
      };
    } catch (error) {
      this.prismaErrors(error);
    }
  }
  async updateFloor(floorId: number, floorStatus: string) {
    try {
      const floorRecord = await this.floorRepository.updateFloor(
        floorId,
        floorStatus,
      );

      return {
        id: floorRecord.id,
        title: floorRecord.title,
        status: floorRecord.status,
      };
    } catch (error) {
      this.prismaErrors(error);
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  // FlOOR
  async findSpaceTypes() {
    try {
      const spaceTypeRecords = await this.spaceTypeRepository.findSpaceTypes();

      return spaceTypeRecords.map((spaceType) => ({
        id: spaceType.id,
        title: spaceType.title,
        status: spaceType.status,
      }));
    } catch (error) {
      this.prismaErrors(error);
    }
  }
  async createSpaceType(request: CreateSpaceTypeRequest) {
    const spaceTypeData = {
      title: request.title,
      status: request.status,
    };

    try {
      const spaceTypeRecord =
        await this.spaceTypeRepository.createSpaceType(spaceTypeData);

      return {
        id: spaceTypeRecord.id,
        title: spaceTypeRecord.title,
        status: spaceTypeRecord.status,
      };
    } catch (error) {
      this.prismaErrors(error);
    }
  }
  async updateSpaceType(spaceTypeId: number, spaceTypeStatus: string) {
    try {
      const spaceTypeRecord = await this.spaceTypeRepository.updateSpaceType(
        spaceTypeId,
        spaceTypeStatus,
      );

      return {
        id: spaceTypeRecord.id,
        title: spaceTypeRecord.title,
        status: spaceTypeRecord.status,
      };
    } catch (error) {
      this.prismaErrors(error);
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  // ADDRESS
  async findAddress() {
    try {
      const addressRecords = await this.addressRepository.findAddress();

      return addressRecords.map((address) => ({
        id: address.id,
        zone: address.zone,
        shortAddress: address.short_address,
        fullAddress: address.full_address,
      }));
    } catch (error) {
      this.prismaErrors(error);
    }
  }
  async createAddress(request: CreateAddressRequest) {
    const addressData = {
      zone: request.zone,
      short_address: request.shortAddress,
      full_address: request.fullAddress,
      ...(request.mapGoogle && { map_google: request.mapGoogle }),
      ...(request.coordinate && { coordinate: request.coordinate }),
      ...(request.photo && { photo: request.photo }),
      status: request.status.toUpperCase(),
    };

    try {
      const addressRecord =
        await this.addressRepository.createAddress(addressData);

      return {
        id: addressRecord.id,
        zone: addressRecord.zone,
        shortAddress: addressRecord.short_address,
        fullAddress: addressRecord.full_address,
        mapGoogle: addressRecord.map_google,
        coordinate: addressRecord.coordinate,
        photo: addressRecord.photo,
        status: addressRecord.status,
      };
    } catch (error) {
      this.prismaErrors(error);
    }
  }
  async updateAddress(addressId: number, request: UpdateAddressRequest) {
    const addressData = {
      ...(request.zone && { zone: request.zone }),
      ...(request.shortAddress && { short_address: request.shortAddress }),
      ...(request.fullAddress && { full_address: request.fullAddress }),
      ...(request.mapGoogle && { map_google: request.mapGoogle }),
      ...(request.coordinate && { coordinate: request.coordinate }),
      ...(request.photo && { map_google: request.photo }),
      ...(request.status && { status: request.status.toUpperCase() }),
    };

    try {
      const addressRecord = await this.addressRepository.updateAddress(
        addressId,
        addressData,
      );

      return {
        id: addressRecord.id,
        zone: addressRecord.zone,
        shortAddress: addressRecord.short_address,
        fullAddress: addressRecord.full_address,
        mapGoogle: addressRecord.map_google,
        coordinate: addressRecord.coordinate,
        photo: addressRecord.photo,
        status: addressRecord.status,
      };
    } catch (error) {
      this.prismaErrors(error);
    }
  }
}
