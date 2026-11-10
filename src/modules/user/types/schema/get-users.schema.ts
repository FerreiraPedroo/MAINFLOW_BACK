import z from "zod";

// INPUT

// OUTPUT
export const GetUsersOutput = z.object({
  id: z.number(),
  email: z.email(),
  name: z.string(),
  birth_date: z.date().nullable(),
  photo: z.string().nullable(),
});
export const GetUsersOutputSchema = z.array(GetUsersOutput);

// CONTROLLER

// SERVICE
