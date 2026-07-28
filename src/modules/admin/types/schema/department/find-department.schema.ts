import z from "zod";

// INPUT

// OUTPUT
const activity = z.object({
  id: z.number(),
  department_id: z.number(),
  sector_id: z.number().nullable(),
  title: z.string(),
  url: z.string(),
  icon: z.string().nullable(),
});
const sector = z.object({
  id: z.number(),
  department_id: z.number(),
  title: z.string(),
  icon: z.string().nullable(),
  activities: z.array(activity),
});

const FindDepartmentsOutput = z.object({
  id: z.number(),
  title: z.string(),
  url: z.string(),
  icon: z.string().nullable(),
  activities: z.array(z.union([sector, activity])),
});

export const FindDepartmentsOutputSchema = z.array(FindDepartmentsOutput);

// CONTROLLER

// SERVICE
export type FindDepartmentsOutput = z.infer<typeof FindDepartmentsOutputSchema>;
