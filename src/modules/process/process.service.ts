import { Injectable } from "@nestjs/common";
import { ProcessModelRepository } from "./interfaces/process-model.repositories";
import { CreateProcessModelRequest } from "./dto/create-process-model-request.dto";
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from "@prisma/client/runtime/client";

@Injectable()
export class ProcessService {
  constructor(private processModelRepository: ProcessModelRepository) {}

  async findAllProcessModels() {
    return await this.processModelRepository.findAllProcessModels();
  }

  async createProcessModel(request: CreateProcessModelRequest) {
    const processModelData = {
      title: request.title,
      process_call: request.processCall,
      status: request.status,
      process_item_id: request.processItemId,
    };

    try {
      return await this.processModelRepository.createProcessModel(
        processModelData,
      );
    } catch (error) {
      if( error instanceof PrismaClientUnknownRequestError)
    }
  }
}
