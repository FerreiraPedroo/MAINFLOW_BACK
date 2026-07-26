import z from "zod";

export const CreateProjectInput = z.object({
  code: z.string().optional(),
  title: z.string(),
  period: z.string(),
  budget: z.coerce.number().nullable(),
  status: z.string(),
  cost_center_id: z.coerce.number().positive(),
});
export const CreateProjectInputSchema = z.tuple([CreateProjectInput]);

export const CreateProjectOutputSchema = z.object({
  id: z.number(),
  code: z.string().nullable(),
  title: z.string(),
  period: z.string(),
  status: z.string(),
  cost_center_id: z.number(),
});

// For Controller
export type CreateProjectDto = z.infer<typeof CreateProjectInput>;

// For Service
export type CreateProjectInput = CreateProjectDto;
export type CreateProjectOutput = z.infer<typeof CreateProjectOutputSchema>;
