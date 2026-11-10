import * as z from "zod";

const procurementIdParam = z.coerce.number().positive();

// INPUT
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
  items: z.array(item).optional(),
});
export const UpdateProcurementInputSchema = z.tuple([
  procurementIdParam,
  UpdateProcurementInput,
]);

// CONTROLLER
export type UpdateProcurementDto = z.infer<typeof UpdateProcurementInput>;

// SERVICE
export type UpdateProcurementInput = UpdateProcurementDto;
