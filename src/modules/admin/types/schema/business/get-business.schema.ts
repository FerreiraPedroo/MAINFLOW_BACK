import z from "zod";

// INPUT
export const GetBusinessInputSchema = z.tuple([z.coerce.number()]);

// OUTPUT
export const GetBusinessOutputSchema = z.object({
  id: z.number(),
  title: z.string(),
  photos: z.string().nullable(),
  cnpj: z.string(),
});

// CONTROLLER

// SERVICE
export type GetBusinessOutput = z.infer<typeof GetBusinessOutputSchema>;
