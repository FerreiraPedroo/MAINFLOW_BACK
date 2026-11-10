import * as z from "zod";

const CreateProcurementInput = z.object({
  title: z.string(),
  description: z.string().optional(),
  type: z.string(),
  status: z.string(),
  cost_center_id: z.coerce.number().positive().optional(),
  project_id: z.coerce.number().positive().optional(),
});
const CreateProcurementOutput = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().optional(),
  type: z.string(),
  status: z.string(),
  cost_center_id: z.number(),
  project_id: z.number().optional(),
});

// SCHEMA > For Validation Service
export const CreateProcurementInputSchema = z.tuple([CreateProcurementInput]);
export const CreateProcurementOutputSchema = CreateProcurementOutput;

// For Controller method assignature
export type CreateProcurementDto = z.infer<typeof CreateProcurementInput>;

// For Service method assignature
export type CreateProcurementInput = CreateProcurementDto;
export type CreateProcurementOutput = z.infer<typeof CreateProcurementOutput>;
