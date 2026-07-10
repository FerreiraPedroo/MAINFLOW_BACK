export interface CreateProcessStepModelRequest {
  title: string;
  page: string;
  sequence: number;
  parallel: boolean;
  finishProcess: boolean;
  processModelId: number;
}
