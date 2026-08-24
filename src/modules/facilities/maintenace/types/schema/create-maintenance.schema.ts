import z from "zod";

// INPUT
const CreateMaintenanceFile = z.custom<Express.Multer.File>().optional();
export const CreateMaintenanceInput = z.object({
  description: z.string(),
  localization_id: z.coerce.number(),
  classification: z.string(),
});
export const CreateMaintenanceInputSchema = z.tuple([
  CreateMaintenanceFile,
  CreateMaintenanceInput,
]);

// OUTPUT
const LocalizationOutput = z.object({
  id: z.number(),
  title: z.string(),
  status: z.string(),
  block: {
    title: z.string(),
  },
  floor: {
    title: z.string(),
  },
  space_type: {
    title: z.string(),
  },
  address: {
    short_address: z.string(),
  },
});

export const CreateMaintenanceOutputSchema = z.object({
  id: z.number(),
  description: z.string(),
  photo: z.string(),
  open_date: z.date(),
  scheduled_date: z.string(),
  finish_date: z.string(),
  status: z.string(),
  classification: z.string(),
  priority: z.string(),
  localization_id: z.string(),
  localization: LocalizationOutput,
});

// CONTROLLER
export type CreateMaintenanceFileDto = z.infer<typeof CreateMaintenanceFile>;
export type CreateMaintenanceDto = z.infer<typeof CreateMaintenanceInput>;

// SERVICE
export type CreateMaintenanceFileInput = CreateMaintenanceFileDto;
export type CreateMaintenanceInput = CreateMaintenanceDto;
export type CreateMaintenanceOutput = z.infer<
  typeof CreateMaintenanceOutputSchema
>;
