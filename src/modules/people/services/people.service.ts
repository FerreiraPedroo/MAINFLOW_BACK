import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

import { FileService } from "@common/modules/file/file.service";
import { DatabaseService } from "@/common/infrastructure/database/prisma/database.service";

import {
  PeopleRepository,
  PeopleRelationshipRepository,
  PeopleJobRepository,
} from "../repository";

import { CreatePeopleRequest } from "../types/dto/create-people-request.dto";
import { UpdatePeopleRequest } from "../types/dto/update-people-request.dto";
import { People, PeopleJob } from "@prisma/client";
import {
  ChangePeopleJobInput,
  CreatePeopleRelationShipFileInput,
  CreatePeopleRelationShipInput,
} from "../types";

@Injectable()
export class PeopleService {
  constructor(
    private readonly peopleRepository: PeopleRepository,
    private readonly peopleJobRepository: PeopleJobRepository,
    private readonly peopleRelationshipRepository: PeopleRelationshipRepository,
    private readonly fileService: FileService,
    private readonly db: DatabaseService,
  ) {}

  private prismaErrors(error: any): never {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2001": {
          throw new UnprocessableEntityException(
            `A pessoa a ser excluída foi não encontrada.`,
          );
          break;
        }
        case "P2002": {
          const meta = error.meta?.driverAdapterError as any;
          const fields = meta?.cause?.constraint?.fields
            ?.join(" / ")
            .toUpperCase();

          throw new UnprocessableEntityException(
            `Existe uma pessoa com esses dados: ${fields}`,
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
  // PEOPLE
  ////////////////////////////////////////////////////////////////////////////////
  async getPeople(peopleId: number) {
    let peopleRecord: People | null;
    try {
      peopleRecord = await this.peopleRepository.getPeople(peopleId);
    } catch (error) {
      this.prismaErrors(error);
    }

    if (!peopleRecord) {
      throw new UnprocessableEntityException("Pessoa não encontrada.");
    }

    return {
      id: peopleRecord.id,
      name: peopleRecord.name,
      registration_number: peopleRecord.registration_number,
      photo: peopleRecord.photo,
      sex: peopleRecord.sex,
      status: peopleRecord.status,
    };
  }
  async findPeoples() {
    try {
      const peopleRecords = await this.peopleRepository.findPeoples();

      return peopleRecords.map((people) => ({
        id: people.id,
        name: people.name,
        registration_number: people.registration_number,
        photo: people.photo,
        sex: people.sex,
        status: people.status,
      }));
    } catch (error) {
      this.prismaErrors(error);
    }
  }
  async createPeople(peopleInput: CreatePeopleRequest) {
    try {
      return await this.peopleRepository.createPeople(peopleInput);
    } catch (error) {
      this.prismaErrors(error);
    }
  }
  async updatePeople(peopleId: number, request: UpdatePeopleRequest) {
    const peopleData = {
      ...(request.name && { name: request.name }),
      ...(request.birthDate && { birth_date: request.birthDate }),
      ...(request.registrationNumber && {
        registration_number: request.registrationNumber,
      }),
      ...(request.photo && { photo: request.photo }),
      ...(request.sex && { sex: request.sex }),
      ...(request.status && { sex: request.status }),
      ...(request.hireDate && { hire_date: request.hireDate }),
      ...(request.terminationDate && {
        termination_date: request.terminationDate,
      }),
    };
    try {
      const peopleRecord = await this.peopleRepository.updatePeople(
        peopleId,
        peopleData,
      );

      return {
        id: peopleRecord.id,
        name: peopleRecord.name,
        birthDate: peopleRecord.birth_date,
        registrationNumber: peopleRecord.registration_number,
        photo: peopleRecord.photo,
        sex: peopleRecord.sex,
        status: peopleRecord.status,
        hireDate: peopleRecord.hire_date,
        terminationDate: peopleRecord.termination_date,
      };
    } catch (error) {
      this.prismaErrors(error);
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  // PEOPLE > RELATIONSHIP
  ////////////////////////////////////////////////////////////////////////////////
  async createPeopleRelationship(
    photo: CreatePeopleRelationShipFileInput,
    peopleRelationshipInput: CreatePeopleRelationShipInput,
  ) {
    let photoUrl: string | null = null;
    if (photo) {
      photoUrl = await this.fileService.fileSave(photo, "people/relationship");
    }

    try {
      // Se não tiver o id da pessoa do relacionamento, tem que ter o name e o grau de relacionamento.
      if (
        !peopleRelationshipInput.related_person_id &&
        (!peopleRelationshipInput.name || !peopleRelationshipInput.kinship)
      ) {
        throw new UnprocessableEntityException(
          "Falta ou o nome ou o grau de relacionamento.",
        );
      }

      const peopleRelationshipData = {
        ...peopleRelationshipInput,
        ...(photoUrl && { photo: photoUrl }),
      };

      const peopleRelationshipRecord =
        await this.peopleRelationshipRepository.createPeopleRelationship(
          peopleRelationshipData,
        );

      if (photo) {
        await this.fileService.removeFile(photo.path);
      }

      return peopleRelationshipRecord;
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
  async deletePeopleRelationship(relationshipId: number) {
    try {
      await this.peopleRelationshipRepository.deletePeopleRelationship(
        relationshipId,
      );

      return "OK";
    } catch (error) {
      this.prismaErrors(error);
    }
  }
  async getPeopleRelationship(peopleId: number) {
    try {
      return await this.peopleRelationshipRepository.getPeopleRelationship(
        peopleId,
      );
    } catch (error) {
      this.prismaErrors(error);
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  // PEOPLE > JOB
  ////////////////////////////////////////////////////////////////////////////////

  async changePeopleJob(changeJob: ChangePeopleJobInput) {
    try {
      const changePeopleJob = {
        ...changeJob,
        ...(changeJob.start_date && {
          start_date: new Date(changeJob.start_date),
        }),
      };
      const peopleJob = await this.peopleJobRepository.findJobsByPeopleId(
        changeJob.people_id,
      );

      let peopleJobActive: PeopleJob[] = [];
      if (peopleJob.length) {
        peopleJobActive = peopleJob.filter((job: any) => job.end_date == null);
      }

      return await this.db.transaction(async () => {
        const promises: Promise<any>[] = [];

        if (peopleJobActive.length) {
          for (const peopleJob of peopleJobActive) {
            promises.push(
              this.peopleJobRepository.updatePeopleJob(peopleJob.id, {
                start_end: new Date(),
              }),
            );
          }
        }

        promises.push(
          this.peopleJobRepository.changePeopleJob(changePeopleJob),
        );

        return await Promise.all(promises);
      });
    } catch (error) {
      this.prismaErrors(error);
    }
  }
}
