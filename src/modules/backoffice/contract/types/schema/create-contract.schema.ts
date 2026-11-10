import z from "zod";

// INPUT
const CreateContractInput = z.object({
  title: z.string(),
  status: z.string(),
  description: z.string().optional(),
  financial_type: z.enum(["RECEITA", "DESPESA"]),
  billing: z.float32(),
  recurrence_frequency: z.enum([
    "MENSAL",
    "BIMESTRAL",
    "TRIMESTRAL",
    "SEMESTRAL",
    "ANUAL",
  ]),
  link_contract: z.string().optional(),
  start_date: z.coerce.date().optional(),
});
export const CreateContractInputSchema = z.tuple([CreateContractInput]);

// OUTPUT
const CreateContractOutput = z.object({
  title: z.string(),
  status: z.string(),
  description: z.string().nullable(),
  financial_type: z.string(),
  billing: z.float32(),
  recurrence_frequency: z.string(),
  link_contract: z.string().nullable(),
  start_date: z.coerce.date().nullable(),
});
export const CreateContractOutputSchema = CreateContractOutput;

// CONTROLLER
export type CreateContractInputDto = z.infer<typeof CreateContractInput>;

// SERVICE
export type CreateContractInput = CreateContractInputDto;
