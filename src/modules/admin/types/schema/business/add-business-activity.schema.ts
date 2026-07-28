import z from "zod";

// INPUT
export const AddActivityToBusinessInput = z.object({
  department_id: z.coerce.number(),
  sector_id: z.coerce.number().optional(),
});
export const AddActivityToBusinessInputSchema = z.tuple([
  z.coerce.number(),
  z.coerce.number(),
  AddActivityToBusinessInput,
]);

// OUTPUT
export const AddActivityToBusinessOutputSchema = z.object({
  id: z.number(),
  department_id: z.number(),
  sector_id: z.number().nullable(),
  activity_id: z.number(),
});

// CONTROLLER
export type AddActivityToBusinessInputDto = z.infer<
  typeof AddActivityToBusinessInput
>;

// SERVICE
export type AddActivityToBusinessInput = AddActivityToBusinessInputDto;
export type AddActivityToBusinessOutput = z.infer<
  typeof AddActivityToBusinessOutputSchema
>;
