import z from "zod";

export const GetAllocationsMonthProjectInputSchema = z.tuple([
  z.coerce.number().positive(),
  z.coerce.number().positive(),
  z.coerce.number().positive(),
]);

const people = z.object({
  id: z.number(),
  name: z.string(),
  photo: z.string().nullable(),
});
export const GetAllocationsMonthProject = z.object({
  project_id: z.number(),
  people_id: z.number(),
  assign_date: z.date(),
  start_hour: z.string(),
  end_hour: z.string(),
  people: people,
});
export const GetAllocationsMonthProjectOutputSchema = z.array(
  GetAllocationsMonthProject,
);

// For Controller

// For Service
export type GetAllocationsMonthProjectOutput = z.infer<
  typeof GetAllocationsMonthProjectOutputSchema
>;
