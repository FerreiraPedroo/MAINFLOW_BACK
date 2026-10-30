import { FileService } from "@common/modules/file/file.service";
import { Injectable, UnprocessableEntityException } from "@nestjs/common";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { MaintenanceRepository } from "./repository/maintenance.repository";

import { getMonthWeeks } from "./utils";

import {
  CreateMaintenanceFileInput,
  CreateMaintenanceInput,
  FindMaintenanceInput,
} from "./types";

@Injectable()
export class MaintenanceService {
  constructor(
    private readonly maintenanceRepository: MaintenanceRepository,
    private readonly fileService: FileService,
  ) {}

  private prismaErrors(error: any): never {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2001": {
          throw new UnprocessableEntityException(
            `O projeto a ser excluído não encontrado.`,
          );
          break;
        }
        case "P2002": {
          const meta = error.meta?.driverAdapterError as any;
          const fields = meta?.cause?.constraint?.fields
            ?.join(" / ")
            .toUpperCase();

          throw new UnprocessableEntityException(
            `Existe um projeto com esses dados: ${fields}`,
          );
          break;
        }
        case "P2025": {
          throw new UnprocessableEntityException(
            "Não foi possivel encontrar um registro necessário para executar a tarefa.",
          );
        }
        default: {
          throw new UnprocessableEntityException(error);
        }
      }
    } else {
      console.log(error);
      throw new UnprocessableEntityException(
        "Não foi possivel executar a ação.",
      );
    }
  }

  async findMaintenance({ year, month, week }: FindMaintenanceInput) {
    try {
      const weeks = getMonthWeeks(year, month);
      const weekSelected = weeks[week];

      return await this.maintenanceRepository.findMaintenance(
        new Date(year, month, weekSelected.startWeekDay),
        new Date(year, month, weekSelected.lastWeekDay),
      );
    } catch (error) {
      this.prismaErrors(error);
    }
  }

  async createMaintenance(
    photo: CreateMaintenanceFileInput,
    maintenanceInput: CreateMaintenanceInput,
  ) {
    let photoUrl: string | null = null;

    try {
      if (photo) {
        photoUrl = await this.fileService.fileSave(photo, "maintenance/photo");
      }

      const nowDate = new Date();
      console.log(nowDate.toISOString());
      const maintenanceData = {
        status: "OPEN",
        open_date: nowDate.toISOString(),
        ...(photoUrl && { photo: photoUrl }),
        ...maintenanceInput,
      };

      const maintenanceRecord =
        await this.maintenanceRepository.createMaintenance(maintenanceData);

      if (photo) {
        await this.fileService.removeFile(photo.path);
      }

      return maintenanceRecord;
    } catch (error) {
      if (photoUrl) {
        await this.fileService.removeFile(photoUrl);
      }
      if (photo) {
        await this.fileService.removeFile(photo.path);
      }

      this.prismaErrors(error);
    }
  }
}
