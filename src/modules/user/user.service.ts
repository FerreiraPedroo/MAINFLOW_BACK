import { FileService } from "./../../common/modules/file/file.service";
import { User } from "@prisma/client";
import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

import { EncryptService } from "@common/service/encrypt.service";

import { UserRepository } from "./repositories/user.repository";

import { CreateUserRequest } from "./types/dto/create-user-request.dto";

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private encryptService: EncryptService,
    private fileService: FileService,
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
      const usersRecord = await this.userRepository.getUsers();

      return usersRecord.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        birthData: user.birth_date,
        photo: user.photo,
      }));
    } catch (error) {
      this.prismaErrors(error);
    }
  }
  async createUser(photo: Express.Multer.File, request: CreateUserRequest) {
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

    let photoUrl;
    if (photo) {
      photoUrl = await this.fileService.fileSave(photo, "users/avatar");
    }

    const userContext = {
      email: request.email,
      password: passwordHash,
      name: request.name,
      ...(request.birthDate && { birth_date: request.birthDate }),
      ...(photoUrl && { photo: photoUrl }),
    };

    let userRecord: User | null;

    try {
      userRecord = await this.userRepository.createUser(userContext);
    } catch (error) {
      if (photoUrl) {
        await this.fileService.removeFile(photoUrl);
      }
      if (photo) {
        await this.fileService.removeFile(photo.path);
      }

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

    return {
      id: "userRecord.id",
      email: "userRecord.email",
      name: "userRecord.name",
      birthDate: "userRecord.birth_date",
      photo: "userRecord.photo",
    };
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
