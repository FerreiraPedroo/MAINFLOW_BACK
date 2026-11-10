import { Injectable, UnprocessableEntityException } from "@nestjs/common";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

import {
  CreateBlockRequest,
  CreateFloorRequest,
  CreateSpaceTypeRequest,
  CreateLocalizationRequest,
  UpdateLocalizationRequest,
  type CreateRoomRequest,
} from "./types";

import {
  LocalizationRepository,
  SpaceTypeRepository,
  FloorRepository,
  BlockRepository,
  RoomRepository,
} from "./repository";

@Injectable()
export class LocalizationService {
  constructor(
    private blockRepository: BlockRepository,
    private floorRepository: FloorRepository,
    private spaceTypeRepository: SpaceTypeRepository,
    private localizationRepository: LocalizationRepository,
    private roomRepository: RoomRepository,
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
  ////////////////////////////////////////////////////////////////////////////////
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
        building: localization.building.short_address,
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
      building_id: Number(request.buildingId),
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
        building: localizationRecord.building.short_address,
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
      ...(request.buildingId && { building_id: request.buildingId }),
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
        building: localizationRecord.building.short_address,
      };
    } catch (error) {
      this.prismaErrors(error);
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  // BLOCK
  ////////////////////////////////////////////////////////////////////////////////
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
  ////////////////////////////////////////////////////////////////////////////////
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
  // ROOM
  ////////////////////////////////////////////////////////////////////////////////
  async findRooms() {
    try {
      const roomRecords = await this.roomRepository.findRooms();

      return roomRecords.map((room) => ({
        id: room.id,
        title: room.title,
        status: room.status,
        floor: room.floor.title,
        block: room.block.title,
      }));
    } catch (error) {
      this.prismaErrors(error);
    }
  }
  async createRoom(request: CreateRoomRequest) {
    const roomData = {
      title: request.title,
      status: request.status,
      floor_id: request.floor_id,
      block_id: request.block_id,
    };

    try {
      const roomRecord = await this.roomRepository.createRoom(roomData);

      return {
        id: roomRecord.id,
        title: roomRecord.title,
        status: roomRecord.status,
        floor_id: roomRecord.floor_id,
        block_id: roomRecord.block_id,
      };
    } catch (error) {
      this.prismaErrors(error);
    }
  }

  async updateRoom(roomId: number, roomStatus: string) {
    try {
      const roomRecord = await this.roomRepository.updateRoom(
        roomId,
        roomStatus,
      );

      return {
        id: roomRecord.id,
        title: roomRecord.title,
        status: roomRecord.status,
        floor: roomRecord.floor.title,
        block: roomRecord.block.title,
      };
    } catch (error) {
      this.prismaErrors(error);
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  // SPACE TYPES
  ////////////////////////////////////////////////////////////////////////////////
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
  // LOCALIZATION BY BUILDING
  ////////////////////////////////////////////////////////////////////////////////
  async getLocalizationsByBuildingId(buildingId: number) {
    try {
      const localizationRecords =
        await this.localizationRepository.findLocalizationsByBuildingId(
          buildingId,
        );

      return localizationRecords;
    } catch (error) {
      this.prismaErrors(error);
    }
  }
  ////////////////////////////////////////////////////////////////////////////////
}
