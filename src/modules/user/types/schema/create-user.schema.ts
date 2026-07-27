import type { Express } from "express";
import z from "zod";

// INPUT
const CreateUserFile = z.custom<Express.Multer.File>().optional();

export const CreateUserInput = z.object({
  email: z.email(),
  password: z.string(),
  name: z.string(),
  birth_date: z.date().optional().nullable(),
});
export const CreateUserInputSchema = z.tuple([CreateUserFile, CreateUserInput]);

// OUTPUT
export const CreateUserOutputSchema = z.object({
  id: z.number(),
  email: z.email(),
  name: z.string(),
  birth_date: z.date(),
  photo: z.string().nullable(),
});

// CONTROLLER

// SERVICE
export type CreateUserOutput = z.infer<typeof CreateUserOutputSchema>;
