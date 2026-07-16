import { Injectable, UnprocessableEntityException } from "@nestjs/common";

import { UserRepository } from "./repositories/user.repository";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { CreateUserRequest } from "./types/dto/create-user-request.dto";

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

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

  async getUserByEmail(email: string) {
    try {
      return await this.userRepository.getUserByEmail(email);
    } catch (error) {
      this.prismaErrors(error);
    }
  }

  async getUser() {
    try {
      return await this.userRepository.getUser();
    } catch (error) {
      this.prismaErrors(error);
    }
  }

  async createUser(request: CreateUserRequest) {
    try {
      const passwordHash = "";

      const photoUrl = "";

      const userData = {
        email: request.email,
        password: passwordHash,
        name: request.name,
        ...(request.birthDate && { birth_date: request.birthDate }),
        photo: photoUrl,
      };

      const userRecord = await this.userRepository.createUser(userData);

      return {
        id: userRecord.id,
        email: userRecord.email,
        name: userRecord.name,
        birthDate: userRecord.birth_date,
        photo: userRecord.photo,
      };
    } catch (error) {
      this.prismaErrors(error);
    }
  }
}
