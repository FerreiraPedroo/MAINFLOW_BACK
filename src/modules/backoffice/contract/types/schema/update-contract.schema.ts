import z from "zod";

// INPUT
const UpdateContractInput = z.object({
  title: z.string(),
  status: z.string(),
  description: z.string().optional(),
  financial_type: z.enum(["RECEITA", "DESPESA"]).optional(),
  billing: z.float32().optional(),
  recurrence_frequency: z
    .enum(["MENSAL", "BIMESTRAL", "TRIMESTRAL", "SEMESTRAL", "ANUAL"])
    .optional(),
  link_contract: z.string().optional(),
  start_date: z.coerce.date().optional(),
});
export const UpdateContractInputSchema = z.tuple([
  z.coerce.number(),
  UpdateContractInput,
]);

// OUTPUT
const UpdateContractOutput = z.object({
  title: z.string(),
  status: z.string(),
  description: z.string().nullable(),
  financial_type: z.string(),
  billing: z.float32(),
  recurrence_frequency: z.string(),
  link_contract: z.string().nullable(),
  start_date: z.coerce.date().nullable(),
});
export const UpdateContractOutputSchema = UpdateContractOutput;

// CONTROLLER
export type UpdateContractInputDto = z.infer<typeof UpdateContractInput>;

// SERVICE
export type UpdateContractInput = UpdateContractInputDto;
