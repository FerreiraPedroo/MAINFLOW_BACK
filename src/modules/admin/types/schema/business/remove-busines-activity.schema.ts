import z from "zod";

// INPUT

export const RemoveBusinessActivityInputSchema = z.tuple([
  z.coerce.number(),
  z.coerce.number(),
]);

// OUTPUT
export const RemoveBusinessActivityOutputSchema = z.string();

// CONTROLLER

// SERVICE
export type RemoveBusinessActivityInput = z.infer<
  typeof RemoveBusinessActivityInputSchema
>;
