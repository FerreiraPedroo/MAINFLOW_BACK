export interface UpdateProjectRequest {
  code?: string | null;
  title?: string;
  period?: string;
  budget?: number;
  status?: string;
  costCenterId?: number | null;
}
