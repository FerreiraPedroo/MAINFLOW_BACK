export interface CreateProjectData {
  code?: string;
  title: string;
  period: string;
  budget: number;
  status: string;
  process_id: number;
  business_unit_id: number;
  cost_center_id?: number;
}
