import { User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { Injectable, UnprocessableEntityException } from "@nestjs/common";

import { FileService } from "@common/modules/file/file.service";
import { EncryptService } from "@common/service/encrypt.service";
import { DatabaseService } from "@/common/infrastructure/database/prisma/database.service";

import { UserRepository } from "./infrastructure/repositories/user.repository";

import { CreateUserInput, CreateUserFileInput } from "./contracts";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encryptService: EncryptService,
    private readonly fileService: FileService,
    private readonly database: DatabaseService,
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

  async getUsers() {
    try {
      return await this.userRepository.getUsers();
    } catch (error) {
      this.prismaErrors(error);
    }
  }

  async createUser(photo: CreateUserFileInput, request: CreateUserInput) {
    const user = await this.userRepository.getUserByEmail(request.email);
    if (user) {
      if (photo) {
        await this.fileService.removeFile(photo.path);
      }
      throw new UnprocessableEntityException(
        "Existe um usuário cadastrado com esse email.",
      );
    }

    const passwordHash = await this.encryptService.generateHash(
      request.password,
    );

    let photoUrl: string | null = null;
    if (photo) {
      photoUrl = await this.fileService.fileSave(photo, "users/avatar");
    }

    let userRecord: User | null;

    try {
      await this.database.transaction(async () => {
        const userData = {
          ...request,
          password: passwordHash,
          photo: photoUrl,
        };

        userRecord = await this.userRepository.createUser(userData);
      });
    } catch (error) {
      if (photoUrl) {
        await this.fileService.removeFile(photoUrl);
      }
      if (photo) {
        await this.fileService.removeFile(photo.path);
      }

      this.prismaErrors(error);
    }

    if (!userRecord!) {
      throw new UnprocessableEntityException(
        "Não foi possivel criar o usuário.",
      );
    }

    return userRecord;
  }

  async getLoggedUser() {
    try {
      return await this.userRepository.getLoggedUser();
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

      return userRecord;
    } catch (error) {
      this.prismaErrors(error);
    }
  }
}
