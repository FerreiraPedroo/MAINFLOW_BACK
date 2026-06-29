export interface GetProjectDto {
  id: number;
  code: string; // PRO-014-261_BS1
  title: string; // [BS] Adequações Estacionamento - Paris 194
  period: string; // 2026.1, 2026.2, 2027.1
  budget: number; // 25000.00 | igual a R$25.000,00
  status: string; // PENDENTE, APROVADO, REJEITADO, RASCUNHO
  process: any;
  center_cost: any;
}
