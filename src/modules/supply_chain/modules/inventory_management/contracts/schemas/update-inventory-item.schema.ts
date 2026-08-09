import * as z from "zod";

// INPUT
const inventoryitemIdParam = z.coerce.number().positive();
const updateInventoryItemInput = z.object({
  title: z.string().optional(),
  code: z.string().optional(),
  unit_measure: z.string().optional(),
  category: z.string().optional(),
  sub_category: z.string().optional(),
  type: z.string().optional(),
  description: z.string().optional(),
  image_path: z.string().optional(),
  hs_code: z.string().optional(),
  manufacturer_id: z.number().optional(),
  manufacturer_part_number: z.string().optional(),
  manufacturer_catalog: z.string().optional(),
  manufacturer_data_sheet: z.string().optional(),
  manufacturer_image_path: z.string().optional(),
});
export const UpdateInventoryItemInputSchema = z.tuple([
  inventoryitemIdParam,
  updateInventoryItemInput,
]);

// OUTPUT
export const UpdateInventoryItemOutputSchema = z.object({
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
export type UpdateInventoryItemDto = z.infer<typeof updateInventoryItemInput>;

// SERVICE
export type UpdateInventoryItemInput = UpdateInventoryItemDto;
export type UpdateInventoryItemOutput = z.infer<
  typeof UpdateInventoryItemOutputSchema
>;
