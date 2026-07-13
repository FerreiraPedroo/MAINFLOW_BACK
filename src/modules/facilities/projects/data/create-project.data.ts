import { ProcessModelData } from "@/modules/process/data/process-model.data";
import { CreateProjectRequest } from "../dto/create-project-request.dto";

export interface CreateProjectData {
  userId: number;
  businessUnitId: number;
  request: CreateProjectRequest;
  processModel: ProcessModelData;
}
