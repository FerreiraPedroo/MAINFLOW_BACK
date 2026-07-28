import z from "zod";

// INPUT
const UpdateBusinessInput = z.object({
  title: z.string().optional(),
  photos: z.string().optional(),
  cnpj: z.string().optional(),
});
export const UpdateBusinessInputSchema = z.tuple([
  z.coerce.number(),
  UpdateBusinessInput,
]);

// OUTPUT
export const UpdateBusinessOutputSchema = z.object({
  id: z.number(),
  title: z.string(),
  photos: z.string().nullable(),
  cnpj: z.string(),
});

// CONTROLLER
export type UpdateBusinessInputDto = z.infer<typeof UpdateBusinessInput>;
export type UpdateBusinessInput = UpdateBusinessInputDto;

// SERVICE
export type UpdateBusinessOutput = z.infer<typeof UpdateBusinessOutputSchema>;
