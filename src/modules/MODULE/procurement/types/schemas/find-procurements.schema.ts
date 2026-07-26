import * as z from "zod";

const FindProcurementsOutput = z.object({
  id: z.number(),
  code: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.string(),
  status: z.string(),
  send_date: z.string().nullable(),
});

// SCHEMA > For Validation Service
// export const FindProcurementsInputSchema = z.tuple([FindProcurementsInput]);
export const FindProcurementsOutputSchema = z.array(FindProcurementsOutput);

// For Controller method assignature
// export type FindProcurementsDto = z.infer<typeof FindProcurementsInput>;

// For Service method assignature
// export type FindProcurementsInput = FindProcurementsDto;
export type FindProcurementsOutput = z.infer<typeof FindProcurementsOutput>;
