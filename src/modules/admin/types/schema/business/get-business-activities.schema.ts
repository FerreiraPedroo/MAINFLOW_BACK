import z from "zod";

// INPUT
export const GetBusinessActivitiesInputSchema = z.tuple([z.coerce.number()]);

// OUTPUT
const activity = z.object({
  id: z.number(),
  title: z.string(),
  url: z.string().optional(),
  icon: z.string().nullable(),
});
const sectorItem = z.object({
  id: z.number(),
  department_id: z.number(),
  sector_id: z.number(),
  title: z.string(),
  icon: z.string().nullable(),
  activities: z.array(activity),
});
const userDepartment = z.object({
  id: z.number(),
  title: z.string(),
  url: z.string(),
  icon: z.string().nullable(),
  activities: z.array(z.union([sectorItem, activity])),
});
export const GetBusinessActivitiesOutputSchema = z.array(userDepartment);

// CONTROLLER

// SERVICE
export type GetBusinessActivitiesOutput = z.infer<typeof userDepartment>;
