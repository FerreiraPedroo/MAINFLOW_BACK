import z from "zod";

// INPUT

// OUTPUT
const FindBusinessOutput = z.object({
  id: z.number(),
  title: z.string(),
  photos: z.string().nullable(),
  cnpj: z.string(),
});

export const FindBusinessOutputSchema = z.array(FindBusinessOutput);

// CONTROLLER

// SERVICE
export type FindBusinessOutput = z.infer<typeof FindBusinessOutputSchema>;
