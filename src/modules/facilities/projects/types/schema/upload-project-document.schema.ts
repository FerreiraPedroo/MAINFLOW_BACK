import type { Express } from "express";
import z from "zod";

// INPUT
const UploadProjectDocumentFile = z.custom<Express.Multer.File>().optional();
const UploadProjectDocumentInput = z.object({
  project_id: z.coerce.number(),
  title: z.string().optional(),
  description: z.string().optional(),
});
export const UploadProjectDocumentInputSchema = z.tuple([
  UploadProjectDocumentFile,
  UploadProjectDocumentInput,
]);

// OUTPUT
export const UploadProjectDocumentOutputSchema = z.object({
  id: z.number(),
  project_id: z.number(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  url: z.string(),
});

// CONTROLLER
export type UploadProjectDocumentFileDto = z.infer<
  typeof UploadProjectDocumentFile
>;
export type UploadProjectDocumentDto = z.infer<
  typeof UploadProjectDocumentInput
>;

// SERVICE
export type UploadProjectDocumentFileInput = UploadProjectDocumentFileDto;
export type UploadProjectDocumentInput = UploadProjectDocumentDto;
export type UploadProjectDocumentOutput = z.infer<
  typeof UploadProjectDocumentOutputSchema
>;
