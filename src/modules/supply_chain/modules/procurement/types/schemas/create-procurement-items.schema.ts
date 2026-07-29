import * as z from "zod";

const CreateProcurementItemsInput = z.object({
  item_id: z.coerce.number().positive(),
  procurement_id: z.coerce.number().positive(),
  quantity: z.coerce.number().positive(),
});

// SCHEMA > For Validation Service
export const CreateProcurementItemsInputSchema = z.tuple([
  z.array(CreateProcurementItemsInput),
]);

// For Controller method assignature
export type CreateProcurementItemsDto = z.infer<
  typeof CreateProcurementItemsInput
>;

// For Service method assignature
export type CreateProcurementItemsInput = CreateProcurementItemsDto;
