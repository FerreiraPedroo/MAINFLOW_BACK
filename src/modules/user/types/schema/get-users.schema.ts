import z from "zod";

// INPUT

// OUTPUT
export const GetUsersOutputSchema = z.object({
  id: z.number(),
  email: z.email(),
  name: z.string(),
  birth_date: z.date(),
  photo: z.string().nullable(),
});

// CONTROLLER

// SERVICE
export type GetUsersOutput = z.infer<typeof GetUsersOutputSchema>;
