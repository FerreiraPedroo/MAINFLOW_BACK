import z from "zod";

// INPUT
const ChangePeopleJob = z.object({
  people_id: z.coerce.number(),
  job_id: z.coerce.number(),
  start_date: z.coerce.date().optional(),
  comment: z.string().optional(),
});
export const ChangePeopleJobInputSchema = z.tuple([ChangePeopleJob]);

// OUTPUT

// CONTROLLER
export type ChangePeopleJobInputDto = z.infer<typeof ChangePeopleJob>;

// SERVICE
export type ChangePeopleJobInput = ChangePeopleJobInputDto;
