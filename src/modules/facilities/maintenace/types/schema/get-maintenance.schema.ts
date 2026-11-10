import z from "zod";

// INPUT
export const GetMaintenanceInput = z.object({
  maintenanceId: z.coerce.number(),
});
export const GetMaintenanceInputSchema = z.tuple([GetMaintenanceInput]);

// OUTPUT
const LocalizationOutput = z.object({
  id: z.number(),
  title: z.string(),
  status: z.string(),
  block: z
    .object({
      title: z.string(),
    })
    .nullable(),
  floor: z
    .object({
      title: z.string(),
    })
    .nullable(),
  space_type: z
    .object({
      title: z.string(),
    })
    .nullable(),
  building: z
    .object({
      short_address: z.string(),
    })
    .nullable(),
});

const GetMaintenanceOutput = z.object({
  id: z.number(),
  description: z.string(),
  photo: z.string().nullable(),
  open_date: z.date().nullable(),
  scheduled_date: z.date().nullable(),
  finish_date: z.date().nullable(),
  status: z.string(),
  classification: z.string(),
  priority: z.string().nullable(),
  localization_id: z.number(),
  localization: LocalizationOutput,
  user_id: z.number(),
  user: {
    id: z.number(),
    email: z.string(),
    name: z.string(),
    photo: z.string(),
  },
});
export const GetMaintenanceOutputSchema = GetMaintenanceOutput;

// CONTROLLER

// SERVICE
export type GetMaintenanceOutput = z.infer<typeof GetMaintenanceOutputSchema>;
