export interface CreateProjectRequest {
  businessId: number;
  code?: string;
  title: string;
  period: string;
  budget?: number;
  status: string;
  costCenterId?: number;
}
