import * as z from "zod";

const UpdateProcurementItensInput = z.object({
  id: z.coerce.number().positive(),
  quantity: z.coerce.number().positive(),
});

// SCHEMA > For Validation Service
export const UpdateProcurementItensInputSchema = z.tuple([
  UpdateProcurementItensInput,
]);

// For Controller method assignature
export type UpdateProcurementItensDto = z.infer<
  typeof UpdateProcurementItensInput
>;

// For Service method assignature
export type UpdateProcurementItensInput = UpdateProcurementItensDto;
