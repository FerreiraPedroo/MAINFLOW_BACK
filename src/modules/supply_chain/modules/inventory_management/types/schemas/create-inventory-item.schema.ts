import * as z from "zod";

// INPUT
const CreateInventoryItemInput = z.object({
  title: z.string(),
  code: z.string(),
  unit_measure: z.string(),
  category: z.string(),
  sub_category: z.string().optional(),
  type: z.string(),
  description: z.string().optional(),
  image_path: z.string().optional(),
  hs_code: z.string().optional(),
  manufacturer_id: z.number().optional(),
  manufacturer_part_number: z.string().optional(),
  manufacturer_catalog: z.string().optional(),
  manufacturer_data_sheet: z.string().optional(),
  manufacturer_image_path: z.string().optional(),
});
export const CreateInventoryItemInputSchema = z.tuple([
  CreateInventoryItemInput,
]);

// OUTPUT
export const CreateInventoryItemOutputSchema = z.object({
  id: z.number(),
  title: z.string(),
  code: z.string(),
  unit_measure: z.string(),
  category: z.string(),
  sub_category: z.string().nullable(),
  type: z.string(),
  description: z.string().nullable(),
  image_path: z.string().nullable(),
  hs_code: z.string().nullable(),
  manufacturer_id: z.number().nullable(),
  manufacturer_part_number: z.string().nullable(),
  manufacturer_catalog: z.string().nullable(),
  manufacturer_data_sheet: z.string().nullable(),
  manufacturer_image_path: z.string().nullable(),
});

// CONTROLLER
export type CreateInventoryItemDto = z.infer<typeof CreateInventoryItemInput>;

// SERVICE
export type CreateInventoryItemInput = CreateInventoryItemDto;
export type CreateInventoryItemOutput = z.infer<
  typeof CreateInventoryItemOutputSchema
>;
