import * as z from "zod";

const CreateProcurementItensInput = z.object({
  item_id: z.coerce.number().positive(),
  procurement_id: z.coerce.number().positive(),
  quantity: z.coerce.number().positive(),
});

// SCHEMA > For Validation Service
export const CreateProcurementItensInputSchema = z.tuple([
  z.array(CreateProcurementItensInput),
]);

// For Controller method assignature
export type CreateProcurementItensDto = z.infer<
  typeof CreateProcurementItensInput
>;

// For Service method assignature
export type CreateProcurementItensInput = CreateProcurementItensDto;
