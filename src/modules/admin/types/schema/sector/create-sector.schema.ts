import z from "zod";

// INPUT
const CreateSectorInput = z.object({
  title: z.string(),
  department_id: z.coerce.number(),
  icon: z.string().nullable().optional(),
  url: z.string(),
});
export const CreateSectorInputSchema = z.tuple([CreateSectorInput]);

// OUTPUT
export const CreateSectorOutputSchema = z.object({
  title: z.string(),
  department_id: z.coerce.number(),
  icon: z.string().nullable().optional(),
  url: z.string(),
});

// CONTROLLER
export type CreateSectorInputDto = z.infer<typeof CreateSectorInput>;

// SERVICE
export type CreateSectorInput = CreateSectorInputDto;
export type CreateSectorOutput = z.infer<typeof CreateSectorOutputSchema>;
