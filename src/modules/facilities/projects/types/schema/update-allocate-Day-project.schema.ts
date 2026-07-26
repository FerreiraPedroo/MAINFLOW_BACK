import z from "zod";

// INPUT
const updateAllocateDayProject = z.object({
  people_id: z.number().positive().optional(),
  start_hour: z.string().optional(),
  end_hour: z.string().optional(),
});
export const UpdateAllocateDayProjectInputSchema = z.tuple([
  z.coerce.number().positive(),
  updateAllocateDayProject,
]);

// OUTPUT
const people = z.object({
  id: z.number(),
  name: z.string(),
  photo: z.string().nullable(),
});
export const UpdateAllocateDayProjectOutputSchema = z.object({
  project_id: z.number(),
  people_id: z.number(),
  assign_date: z.date(),
  start_hour: z.string(),
  end_hour: z.string(),
  people: people,
});

// For Controller
export type UpdateAllocateDayProjectDto = z.infer<
  typeof updateAllocateDayProject
>;
// For Service
export type UpdateAllocateDayProjectInput = UpdateAllocateDayProjectDto;
export type UpdateAllocateDayProjectOutput = z.infer<
  typeof UpdateAllocateDayProjectOutputSchema
>;
