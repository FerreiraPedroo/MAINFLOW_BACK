import * as z from "zod";

const UpdateProcurementItemsInput = z.object({
  id: z.coerce.number().positive(),
  quantity: z.coerce.number().positive(),
});

// SCHEMA > For Validation Service
export const UpdateProcurementItemsInputSchema = z.tuple([
  UpdateProcurementItemsInput,
]);

// For Controller method assignature
export type UpdateProcurementItemsDto = z.infer<
  typeof UpdateProcurementItemsInput
>;

// For Service method assignature
export type UpdateProcurementItemsInput = UpdateProcurementItemsDto;
