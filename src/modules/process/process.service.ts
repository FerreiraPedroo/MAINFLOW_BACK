import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

import { ProcessModelRepository } from "./repository/process-model.repositories";
import { ProcessStepModelRepository } from "./repository/process-step-model.repositories";

import { CreateProcessModelRequest } from "./dto/create-process-model-request.dto";
import { UpdateProcessModelRequest } from "./interfaces/update-process-model-request.interface";
import { CreateProcessStepModelRequest } from "./interfaces/create-process-step-model-request.interface";

@Injectable()
export class ProcessService {
  constructor(
    private processModelRepository: ProcessModelRepository,
    private processStepModelRepository: ProcessStepModelRepository,
  ) {}

  // PROCESS
  async getProcessModelByProcessCall(processCall: string) {
    return await this.processModelRepository.getProcessModelByProcessCall(
      processCall,
    );
  }
  async findAllProcessModels() {
    return await this.processModelRepository.findAllProcessModels();
  }
  async createProcessModel(request: CreateProcessModelRequest) {
    const processModelData = {
      title: request.title,
      process_call: request.processCall,
      status: request.status,
    };

    try {
      return await this.processModelRepository.createProcessModel(
        processModelData,
      );
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code == "P2002"
      ) {
        const meta = error.meta?.driverAdapterError as any;
        const fields = meta?.cause?.constraint?.fields
          ?.join(" / ")
          .toUpperCase();
        throw new UnprocessableEntityException(
          `Existe um processo com esses dados: ${fields}`,
        );
      } else {
        throw new UnprocessableEntityException(
          "Erro ao criar o modelo de processo.",
        );
      }
    }
  }
  async updateProcessModel(request: UpdateProcessModelRequest) {
    // Verifica se foi enviado algum capo para ser atualizado.
    const requestFields = Object.keys(request);
    if (requestFields.length <= 1) {
      throw new UnprocessableEntityException(
        "Não foi enviado nenhum campo para ser atualizado.",
      );
    }

    // Procurar o 'process model' do 'id' enviado
    const processModel = await this.processModelRepository.getProcessModelById(
      request.id,
    );
    if (!processModel) {
      throw new UnprocessableEntityException(
        "Não existe um modelo de processo com esse id.",
      );
    }

    const processModelData = {
      id: request.id,
      ...(request.title && { title: request.title }),
      ...(request.processCall && { process_call: request.processCall }),
      ...(request.status && { status: request.status }),
    };

    try {
      return await this.processModelRepository.updateProcessModel(
        processModelData,
      );
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code == "P2002"
      ) {
        const meta = error.meta?.driverAdapterError as any;
        const fields = meta?.cause?.constraint?.fields
          ?.join(" / ")
          .toUpperCase();

        throw new UnprocessableEntityException(
          `Existe um modelo de processo com o mesmo: ${fields}`,
        );
      } else {
        throw new UnprocessableEntityException(
          "Erro ao criar o modelo de processo.",
        );
      }
    }
  }

  // PROCESS-STEP
  async getProcessStepModel(processStepModelId: number) {
    const processStepModel =
      await this.processStepModelRepository.getProcessStepModelById(
        processStepModelId,
      );

    if (!processStepModel) {
      throw new UnprocessableEntityException(
        "Modelo da etapa do processo não foi encontrado.",
      );
    } else {
      return processStepModel;
    }
  }
  async createProcessStepModel(request: CreateProcessStepModelRequest) {
    const processStepModelData = {
      title: request.title,
      page: request.page,
      sequence: request.sequence,
      parallel: request.parallel,
      finish_process: request.finishProcess,
      process_model_id: request.processModelId,
    };

    try {
      return await this.processStepModelRepository.createProcessStepModel(
        processStepModelData,
      );
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code == "P2002"
      ) {
        const meta = error.meta?.driverAdapterError as any;
        const fields = meta?.cause?.constraint?.fields
          ?.join(" / ")
          .toUpperCase();
        throw new UnprocessableEntityException(
          `Existe uma etapa de processo com esses dados: ${fields}`,
        );
      } else {
        throw new UnprocessableEntityException(
          "Erro ao criar o modelo da etapa de processo.",
        );
      }
    }
  }
}
