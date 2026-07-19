import { PeopleRepository } from "./repository/people.repository";
import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { CreatePeopleRequest } from "./types/dto/create-people-request.dto";

@Injectable()
export class PeopleService {
  constructor(private peopleRepository: PeopleRepository) {}

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
            `Existe um peopleo com esses dados: ${fields}`,
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
  // async findPeople() {
  //   try {
  //     const peopleRecords = await this.peopleRepository.findPeople();

  //     return peopleRecords.map((people) => ({
  //       id: people.id,
  //       title: people.title,
  //       status: people.status,
  //     }));
  //   } catch (error) {
  //     this.prismaErrors(error);
  //   }
  // }
  // async createPeople(request: CreatePeopleRequest) {
  //   const peopleData = {
  //     title: request.title,
  //     status: request.status,
  //   };

  //   try {
  //     const peopleRecord = await this.peopleRepository.createPeople(peopleData);

  //     return {
  //       id: peopleRecord.id,
  //       title: peopleRecord.title,
  //       status: peopleRecord.status,
  //     };
  //   } catch (error) {
  //     this.prismaErrors(error);
  //   }
  // }
  // async updatePeople(peopleId: number, peopleStatus: string) {
  //   try {
  //     const peopleRecord = await this.peopleRepository.updatePeople(
  //       peopleId,
  //       peopleStatus,
  //     );

  //     return {
  //       id: peopleRecord.id,
  //       title: peopleRecord.title,
  //       status: peopleRecord.status,
  //     };
  //   } catch (error) {
  //     this.prismaErrors(error);
  //   }
  // }
}
