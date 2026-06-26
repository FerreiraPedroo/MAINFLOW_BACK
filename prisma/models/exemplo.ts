import { prisma } from "@/database/prisma/prisma.js";

const processModel = {
  id: 1,
  title: "CREATE:Project",
  process_call: "POST:process",
  status: "ATIVO",
  process_steps_model: [1, 2, 3],
  business_unit_id: 1,
  department_id: 1,
  sector_id: 1,
};
const processInstance = {
  id: 1,
  process_model_id: 1,
  history: [
    {
      date: "26/06/2026",
      user: 1,
      status: "APROVADO",
      mensagem: "Processo aprovado.",
    },
  ],
  process_steps_instances: [1, 2, 3],
  project: [1],
  user_id: 1,

  business_unit_id: 1,
  department_id: 1,
  sector_id: 1,
};

const project = {
  code: "PRO-014-261_BS1",
  title: "[BS] Adequações Estacionamento - Paris 194",
  period: "2026.1",
  budget: "25000.00",
  status: "PENDENTE",
  process_id: 1,
  business_unit_id: 1,
  center_cost_id: 1,
};
