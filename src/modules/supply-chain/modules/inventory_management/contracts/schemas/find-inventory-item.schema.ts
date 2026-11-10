import * as z from "zod";

// INPUT

//OUTPUT
export const FindInventoryItemsOutput = z.object({
  id: z.number(),
  title: z.string(),
  code: z.string(),
  category: z.string(),
  sub_category: z.string().nullable(),
  type: z.string(),
  image_path: z.string().nullable(),
});
export const FindInventoryItemsOutputSchema = z.array(FindInventoryItemsOutput);

// CONTROLLER

// SERVICE
export type FindInventoryItemsOutput = z.infer<
  typeof FindInventoryItemsOutputSchema
>;
