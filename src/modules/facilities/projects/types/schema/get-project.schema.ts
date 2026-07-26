import z from "zod";

export const GetProjectInput = z.coerce.number().positive();
export const GetProjectInputSchema = z.tuple([GetProjectInput]);

const costCenter = z.object({
  id: z.coerce.number(),
  title: z.string(),
  description: z.string().nullable(),
});
const procurements = z.object({
  id: z.number(),
  code: z.string(),
  title: z.string(),
  status: z.string(),
});
const people = z.object({
  id: z.number(),
  name: z.string(),
  photo: z.string().nullable(),
});
const projectAllocations = z.object({
  project_id: z.coerce.number(),
  people_id: z.coerce.number(),
  assign_date: z.coerce.date(),
  start_hour: z.string(),
  end_hour: z.string(),
  people: people,
});
export const GetProjectOutputSchema = z.object({
  id: z.number(),
  code: z.string().nullable(),
  title: z.string(),
  period: z.string(),
  budget: z.number().nullable(),
  status: z.string(),
  cost_center_id: z.number(),
  cost_center: costCenter,
  procurements: z.array(procurements),
  project_allocations: z.array(projectAllocations),
});

// For Controller
export type GetProjectInputDto = z.infer<typeof GetProjectInput>;
// For Service
export type GetProjectInput = z.infer<typeof GetProjectInputSchema>;
export type GetProjectOutput = z.infer<typeof GetProjectOutputSchema>;
