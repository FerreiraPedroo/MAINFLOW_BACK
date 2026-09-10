import z from "zod";

// INPUT
const UpdatePeopleJob = z.object({
  start_date: z.date().optional(),
  start_end: z.date().optional(),
  comment: z.string().optional(),
});
export const UpdatePeopleJobInputSchema = z.tuple([
  z.coerce.number(),
  UpdatePeopleJob,
]);

// OUTPUT

// CONTROLLER
export type UpdatePeopleJobInputDto = z.infer<typeof UpdatePeopleJob>;

// SERVICE
export type UpdatePeopleJobInput = UpdatePeopleJobInputDto;
