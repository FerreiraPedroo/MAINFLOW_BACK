export interface CreateProcurementRequest {
  title: string;
  description?: string;
  type: string;
  status: string;
  costCenterId: number;
}
