export interface CreateProjectRequest {
  code?: string;
  title: string;
  period: string;
  budget?: number;
  status: string;
  costCenterId?: number;
}
