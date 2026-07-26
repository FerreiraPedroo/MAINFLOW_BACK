import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

import { PeopleRepository } from "./repository/people.repository";

import { CreatePeopleRequest } from "./types/dto/create-people-request.dto";
import { UpdatePeopleRequest } from "./types/dto/update-people-request.dto";
import { People } from "@prisma/client";

@Injectable()
export class PeopleService {
  constructor(private peopleRepository: PeopleRepository) {}

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
  async createPeople(request: CreatePeopleRequest) {
    const peopleData = {
      name: request.name,
      birth_date: request.birth_date,
      status: request.status,
      ...(request.registration_number && {
        registration_number: request.registration_number,
      }),
      ...(request.photo && { photo: request.photo }),
      ...(request.sex && { sex: request.sex }),
      ...(request.hire_date && { hire_date: request.hire_date }),
      ...(request.termination_date && {
        termination_date: request.termination_date,
      }),
    };

    try {
      const peopleRecord = await this.peopleRepository.createPeople(peopleData);

      return {
        id: peopleRecord.id,
        name: peopleRecord.name,
        registration_number: peopleRecord.registration_number,
        photo: peopleRecord.photo,
        sex: peopleRecord.sex,
        status: peopleRecord.status,
        hire_date: peopleRecord.hire_date,
        termination_date: peopleRecord.termination_date,
      };
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
}
