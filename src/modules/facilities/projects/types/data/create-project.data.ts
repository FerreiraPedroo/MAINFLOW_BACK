export interface CreateProjectData {
  code: string | null;
  title: string;
  period: string;
  budget: number | null;
  status: string;
  // process_id?: number;
  cost_center_id: number | null;
}
