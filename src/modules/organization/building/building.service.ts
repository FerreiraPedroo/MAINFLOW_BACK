import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

import { BuildingRepository } from "./repository/building.repository";
import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { CreateBuildingRequest, UpdateBuildingRequest } from "./types";

@Injectable()
export class BuildingService {
  constructor(private buildingRepository: BuildingRepository) {}

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
  // BUILDING
  ////////////////////////////////////////////////////////////////////////////////
  async findBuilding() {
    try {
      return await this.buildingRepository.findBuilding();
    } catch (error) {
      this.prismaErrors(error);
    }
  }
  async getBuilding(buildingId: number) {
    try {
      return await this.buildingRepository.getBuilding(buildingId);
    } catch (error) {
      this.prismaErrors(error);
    }
  }
  async createBuilding(request: CreateBuildingRequest) {
    const buildingData = {
      zone: request.zone,
      type: request.type,
      short_address: request.short_address,
      full_address: request.full_address,
      ...(request.map_google && { map_google: request.map_google }),
      ...(request.coordinate && { coordinate: request.coordinate }),
      ...(request.photo && { photo: request.photo }),
      status: request.status.toUpperCase(),
    };

    try {
      const buildingRecord =
        await this.buildingRepository.createBuilding(buildingData);

      return {
        id: buildingRecord.id,
        zone: buildingRecord.zone,
        shortBuilding: buildingRecord.short_address,
        fullAddress: buildingRecord.full_address,
        mapGoogle: buildingRecord.map_google,
        coordinate: buildingRecord.coordinate,
        photo: buildingRecord.photo,
        status: buildingRecord.status,
      };
    } catch (error) {
      this.prismaErrors(error);
    }
  }
  async updateBuilding(buildingId: number, request: UpdateBuildingRequest) {
    const buildingData = {
      ...(request.zone && { zone: request.zone }),
      ...(request.shortAddress && { short_address: request.shortAddress }),
      ...(request.fullAddress && { full_address: request.fullAddress }),
      ...(request.mapGoogle && { map_google: request.mapGoogle }),
      ...(request.coordinate && { coordinate: request.coordinate }),
      ...(request.photo && { photo: request.photo }),
      ...(request.status && { status: request.status.toUpperCase() }),
    };

    try {
      const buildingRecord = await this.buildingRepository.updateBuilding(
        buildingId,
        buildingData,
      );

      return {
        id: buildingRecord.id,
        zone: buildingRecord.zone,
        shortAddress: buildingRecord.short_address,
        fullAddress: buildingRecord.full_address,
        mapGoogle: buildingRecord.map_google,
        coordinate: buildingRecord.coordinate,
        photo: buildingRecord.photo,
        status: buildingRecord.status,
      };
    } catch (error) {
      this.prismaErrors(error);
    }
  }
}
