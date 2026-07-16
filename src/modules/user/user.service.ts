import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

import { EncryptService } from "@/common/service/encrypt.service";

import { UserRepository } from "./repositories/user.repository";

import { CreateUserRequest } from "./types/dto/create-user-request.dto";
import { User } from "@prisma/client";

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private encryptService: EncryptService,
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
          console.log(error.meta?.driverAdapterError as any);
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

  async getUser() {
    try {
      const userRecord = await this.userRepository.getUser();

      if (userRecord == null) {
        throw new UnprocessableEntityException("Usuário não encontrado.");
      }

      return {
        id: userRecord.id,
        email: userRecord.email,
        name: userRecord.name,
        birth_date: userRecord.birth_date,
        photo: userRecord.photo,
      };
    } catch (error) {
      this.prismaErrors(error);
    }
  }
  async getUserByEmail(email: string) {
    try {
      const userRecord = await this.userRepository.getUserByEmail(email);

      if (userRecord == null) {
        throw new UnprocessableEntityException("Usuário não encontrado.");
      }

      return {
        id: userRecord.id,
        email: userRecord.email,
        name: userRecord.name,
        birth_date: userRecord.birth_date,
        photo: userRecord.photo,
      };
    } catch (error) {
      this.prismaErrors(error);
    }
  }
  async getUsers() {
    try {
      const userRecords = await this.userRepository.getUsers();

      return userRecords.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        birth_date: user.birth_date,
        photo: user.photo,
      }));
    } catch (error) {
      this.prismaErrors(error);
    }
  }
  async createUser(request: CreateUserRequest) {
    const user = await this.userRepository.getUserByEmail(request.email);
    if (user) {
      throw new UnprocessableEntityException(
        "Existe um usuário cadastrado com esse email.",
      );
    }

    const passwordHash = await this.encryptService.generateHash(
      request.password,
    );

    // let photoUrl;
    // if(request.file){
    // }

    const userData = {
      email: request.email,
      password: passwordHash,
      name: request.name,
      ...(request.birthDate && { birth_date: request.birthDate }),
      ...(request.file && { photo: request.file.originalname }),
    };

    let userRecord: User | null;

    try {
      userRecord = await this.userRepository.createUser(userData);
    } catch (error) {
      this.prismaErrors(error);
    }

    if (!userRecord) {
      throw new UnprocessableEntityException(
        "Não foi possivel criar o usuário.",
      );
    }

    return {
      id: userRecord.id,
      email: userRecord.email,
      name: userRecord.name,
      birthDate: userRecord.birth_date,
      photo: userRecord.photo,
    };
  }
}
