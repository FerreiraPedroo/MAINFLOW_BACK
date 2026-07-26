import z from "zod";

// INPUT
export const DeleteAllocateDayProjectInputSchema = z.tuple([
  z.coerce.number().positive(),
]);

// OUTPUT
const people = z.object({
  id: z.number(),
  name: z.string(),
  photo: z.string().nullable(),
});
export const DeleteAllocateDayProject = z.object({
  project_id: z.number(),
  people_id: z.number(),
  assign_date: z.date(),
  start_hour: z.string(),
  end_hour: z.string(),
  people: people,
});
export const DeleteAllocateDayProjectOutputSchema = z.array(
  DeleteAllocateDayProject,
);

// For Controller

// For Service
export type DeleteAllocateDayProjectOutput = z.infer<
  typeof DeleteAllocateDayProjectOutputSchema
>;
