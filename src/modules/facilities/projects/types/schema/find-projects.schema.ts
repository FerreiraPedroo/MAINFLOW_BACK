import z from "zod";

const FindProjectsOutput = z.object({
  id: z.number(),
  code: z.string().nullable(),
  title: z.string(),
  period: z.string(),
  status: z.string(),
});
export const FindProjectsOutputSchema = z.array(FindProjectsOutput);

// For Service
export type FindProjectsOutput = z.infer<typeof FindProjectsOutputSchema>;
