export interface CreateProjectRequest {
  businessId: number;
  projectData: {
    code?: string;
    title: string;
    period: string;
    budget?: number;
    status: string;
    costCenterId?: number;
  };
}
