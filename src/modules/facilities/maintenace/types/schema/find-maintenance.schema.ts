import z from "zod";

// INPUT
export const FindMaintenanceInput = z.object({
  year: z.coerce.number(),
  month: z.coerce.number(),
  week: z.coerce.number(),
});
export const FindMaintenanceInputSchema = z.tuple([
  z.coerce.number(),
  z.coerce.number(),
  z.coerce.number(),
]);

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
  address: z
    .object({
      short_address: z.string(),
    })
    .nullable(),
});

const FindMaintenanceOutput = z.object({
  id: z.number(),
  description: z.string(),
  photo: z.string().nullable(),
  open_date: z.date(),
  scheduled_date: z.date().nullable(),
  finish_date: z.date().nullable(),
  status: z.string(),
  classification: z.string(),
  priority: z.string().nullable(),
  localization_id: z.number(),
  localization: LocalizationOutput,
});
export const FindMaintenanceOutputSchema = z.array(FindMaintenanceOutput);

// CONTROLLER
export type FindMaintenanceDto = z.infer<typeof FindMaintenanceInput>;

// SERVICE
export type FindMaintenanceInput = FindMaintenanceDto;
export type FindMaintenanceOutput = z.infer<typeof FindMaintenanceOutputSchema>;
