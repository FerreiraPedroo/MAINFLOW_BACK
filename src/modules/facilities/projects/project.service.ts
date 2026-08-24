import { FileService } from "@common/modules/file/file.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { Injectable, UnprocessableEntityException } from "@nestjs/common";

import { ProjectRepository, ProjectDocumentRepository } from "./repository";

import {
  FindProjectsOutput,
  GetProjectOutput,
  CreateProjectInput,
  CreateProjectOutput,
  UpdateProjectInput,
  UploadProjectDocumentFileInput,
  UploadProjectDocumentInput,
} from "./types";
import { ProjectDocument } from "@prisma/client";

@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly projectDocumentRepository: ProjectDocumentRepository,
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

  async getProjectById(projectId: number): Promise<GetProjectOutput> {
    let project;

    try {
      project = await this.projectRepository.getProjectsById(projectId);
    } catch (error) {
      this.prismaErrors(error);
    }

    if (project) {
      return project;
    } else {
      throw new UnprocessableEntityException("Projeto não encontrado.");
    }
  }
  async findProjects(): Promise<FindProjectsOutput> {
    try {
      const projects = await this.projectRepository.findProjects();

      if (!projects) {
        return [];
      } else {
        return projects;
      }
    } catch (error) {
      this.prismaErrors(error);
    }
  }
  async createProject(
    projectInput: CreateProjectInput,
  ): Promise<CreateProjectOutput> {
    try {
      return await this.projectRepository.createProject(projectInput);
    } catch (error) {
      this.prismaErrors(error);
    }
  }
  async updateProject(projectId: number, projectInput: UpdateProjectInput) {
    try {
      return await this.projectRepository.updateProject(
        projectId,
        projectInput,
      );
    } catch (error) {
      this.prismaErrors(error);
    }
  }
  async deleteProject(projectId: number) {
    try {
      return await this.projectRepository.deleteProject(projectId);
    } catch (error) {
      this.prismaErrors(error);
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  //
  ////////////////////////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////////////////////////
  // DOCUMENTS
  ////////////////////////////////////////////////////////////////////////////////
  async uploadDocument(
    document: UploadProjectDocumentFileInput,
    documentInput: UploadProjectDocumentInput,
  ) {
    let documentUrl: string | null = null;

    try {
      if (document) {
        documentUrl = await this.fileService.fileSave(document, "users/avatar");
      } else {
        throw new UnprocessableEntityException("Deve enviar um documento.");
      }

      const documentData = {
        ...documentInput,
        url: documentUrl,
      };

      return this.projectDocumentRepository.uploadDocument(documentData);
    } catch (error) {
      if (documentUrl) {
        await this.fileService.removeFile(documentUrl);
      }
      if (document) {
        await this.fileService.removeFile(document.path);
      }

      this.prismaErrors(error);
    }
  }
  async deleteDocument(documentId: number) {
    let document: ProjectDocument;
    try {
      document =
        await this.projectDocumentRepository.deleteDocument(documentId);
    } catch (error) {
      this.prismaErrors(error);
    }

    if (document) {
      await this.fileService.removeFile(document.url);
    }

    return "OK";
  }
}
