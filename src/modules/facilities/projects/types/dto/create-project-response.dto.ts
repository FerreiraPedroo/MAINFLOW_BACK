export interface CreateProjectResponse {
  id: number;
  code: string | null;
  title: string;
  period: string;
  budget: number | null;
  status: string;
  businessUnitId: number;
  costCenterId: number | null;
  // processId: number;
}
