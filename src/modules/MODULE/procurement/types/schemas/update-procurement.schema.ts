import * as z from "zod";

const procurementIdParam = z.coerce.number().positive();

const item = z.object({
  item_id: z.coerce.number().positive(),
  quantity: z.coerce.number().positive(),
});
const UpdateProcurementInput = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  type: z.string().optional(),
  status: z.string().optional(),
  cost_center_id: z.coerce.number().positive().optional(),
  project_id: z.coerce.number().positive().optional(),
  itens: z.array(item).optional(),
});

const UpdateProcurementOutput = z.object({
  title: z.string(),
  description: z.string().optional(),
  type: z.string(),
  status: z.string(),
  cost_center_id: z.coerce.number(),
  project_id: z.coerce.number().optional(),
});

// SCHEMA > For Validation Service
export const UpdateProcurementInputSchema = z.tuple([
  procurementIdParam,
  UpdateProcurementInput,
]);
export const UpdateProcurementOutputSchema = UpdateProcurementOutput;

// For Controller method assignature
export type UpdateProcurementDto = z.infer<typeof UpdateProcurementInput>;

// For Service method assignature
export type UpdateProcurementInput = UpdateProcurementDto;
export type UpdateProcurementOutput = z.infer<typeof UpdateProcurementOutput>;
