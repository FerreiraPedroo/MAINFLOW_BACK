export interface UpdateProcurementRequest {
  title?: string;
  description?: string;
  type?: string;
  status?: string;
  costCenterId?: number;
  projectId?: number;
  itens?: { itemId: number; quantity: number }[];
}
