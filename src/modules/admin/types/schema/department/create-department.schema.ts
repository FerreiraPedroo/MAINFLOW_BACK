import z from "zod";

// INPUT
const CreateDepartmentInput = z.object({
  title: z.string(),
  url: z.string(),
  icon: z.string().nullable().optional(),
});
export const CreateDepartmentInputSchema = z.tuple([CreateDepartmentInput]);

// OUTPUT
export const CreateDepartmentOutputSchema = z.object({
  id: z.number(),
  title: z.string(),
  url: z.string(),
  icon: z.string().nullable(),
});

// CONTROLLER
export type CreateDepartmentInputDto = z.infer<typeof CreateDepartmentInput>;

// SERVICE
export type CreateDepartmentInput = CreateDepartmentInputDto;
export type CreateDepartmentOutput = z.infer<
  typeof CreateDepartmentOutputSchema
>;
