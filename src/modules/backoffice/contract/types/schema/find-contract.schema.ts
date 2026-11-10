import z from "zod";

// INPUT
const FindContractInput = z.object({
  cursor: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(20),
  title: z.string().optional(),
  status: z.string().optional(),
  financial_type: z.string().optional(),
});
export const FindContractInputSchema = z.tuple([FindContractInput]);

// OUTPUT
const Contract = z.object({
  id: z.number(),
  title: z.string(),
  status: z.string(),
  description: z.string().nullable(),
  financial_type: z.string(),
  billing: z.float32(),
  recurrence_frequency: z.string(),
  link_contract: z.string().nullable(),
  start_date: z.coerce.date().nullable(),
});
const FindContractOutput = z.object({
  contracts: z.array(Contract),
  cursor: z.number(),
});
export const FindContractOutputSchema = FindContractOutput;

// CONTROLLER
export type FindContractInputDto = z.infer<typeof FindContractInput>;

// SERVICE
export type FindContractInput = FindContractInputDto;
