import z from "zod";

export const UpdateProjectInput = z.object({
  code: z.string().optional(),
  title: z.string().optional(),
  period: z.string().optional(),
  budget: z.coerce.number().nullable().optional(),
  status: z.string().optional(),
  cost_center_id: z.coerce.number().positive().optional(),
});
export const UpdateProjectInputSchema = z.tuple([
  z.coerce.number().positive(),
  UpdateProjectInput,
]);

export const UpdateProjectOutputSchema = z.object({
  id: z.number(),
  code: z.string().nullable(),
  title: z.string(),
  period: z.string(),
  status: z.string(),
});

// For Controller
export type UpdateProjectDto = z.infer<typeof UpdateProjectInput>;

// For Service
export type UpdateProjectInput = UpdateProjectDto;
export type UpdateProjectOutput = z.infer<typeof UpdateProjectOutputSchema>;
