import z from "zod";

export const CreateAllocatePeopleToProjectInput = z.object({
  project_id: z.coerce.number(),
  people_id: z.coerce.number(),
  assign_date: z.coerce.date(),
  start_hour: z.string(),
  end_hour: z.string(),
});
export const CreateAllocatePeopleToInputSchema = z.tuple([
  CreateAllocatePeopleToProjectInput,
]);

export const CreateAllocatePeopleToOutputSchema = z.object({
  project_id: z.number(),
  people_id: z.number(),
  assign_date: z.date(),
  start_hour: z.string(),
  end_hour: z.string(),
});

// For Controller
export type CreateAllocatePeopleToProjectDto = z.infer<
  typeof CreateAllocatePeopleToProjectInput
>;

// For Service
export type CreateAllocatePeopleToInput = CreateAllocatePeopleToProjectDto;
export type CreateAllocatePeopleToOutput = z.infer<
  typeof CreateAllocatePeopleToOutputSchema
>;
