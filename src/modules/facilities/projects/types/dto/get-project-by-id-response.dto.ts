export interface GetProjectByIdResponse {
  id: number;
  code: string | null; // PRO-014-261_BS1
  title: string; // [BS] Adequações Estacionamento - Paris 194
  period: string; // 2026.1, 2026.2, 2027.1
  budget: number | null; // 25000.00 | igual a R$25.000,00
  status: string; // PENDENTE, APROVADO, REJEITADO, RASCUNHO
  costCenter: {
    id: number;
    title: string;
    description: string | null;
  } | null;
  procurements: { id: number; code: string; title: string; status: string }[];
}
