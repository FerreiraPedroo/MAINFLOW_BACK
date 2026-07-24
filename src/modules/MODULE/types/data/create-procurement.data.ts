export interface CreateProcurementData {
  code: string;
  title: string;
  description?: string;
  type: string;
  status: string;
  cost_center_id: number;
}
