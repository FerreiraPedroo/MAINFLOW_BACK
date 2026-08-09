import type { Express } from "express";
import z from "zod";

// INPUT
const CreateUserFile = z.custom<Express.Multer.File>().optional();
const CreateUserInput = z.object({
  email: z.email(),
  password: z.string(),
  name: z.string(),
  birth_date: z.date().optional(),
});
export const CreateUserInputSchema = z.tuple([CreateUserFile, CreateUserInput]);

// OUTPUT
export const CreateUserOutputSchema = z.object({
  id: z.number(),
  email: z.email(),
  name: z.string(),
  birth_date: z.date().nullable(),
  photo: z.string().nullable(),
});

// CONTROLLER
export type CreateUserFileDto = z.infer<typeof CreateUserFile>;
export type CreateUserDto = z.infer<typeof CreateUserInput>;

// SERVICE
export type CreateUserFileInput = CreateUserFileDto;
export type CreateUserInput = CreateUserDto;
export type CreateUserOutput = z.infer<typeof CreateUserOutputSchema>;
