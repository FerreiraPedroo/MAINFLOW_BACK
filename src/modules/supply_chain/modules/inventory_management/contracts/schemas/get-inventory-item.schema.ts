import * as z from "zod";

// INPUT
export const GetInventoryItemInputSchema = z.tuple([
  z.coerce.number().positive(),
]);

// OUTPUT
const manufacturer = z.object({
  id: z.number(),
  legal_name: z.string(),
  trade_name: z.string(),
  tax_number: z.string(),
  supplier_category: z.string(),
});
export const GetInventoryItemOutputSchema = z.object({
  id: z.number(),
  title: z.string(),
  code: z.string(),
  unit_measure: z.string(),
  category: z.string(),
  sub_category: z.string(),
  type: z.string(),
  description: z.string().nullable(),
  image_path: z.string().nullable(),
  hs_code: z.string().nullable(),
  manufacturer_id: z.number().nullable(),
  manufacturer_part_number: z.string().nullable(),
  manufacturer_catalog: z.string().nullable(),
  manufacturer_data_sheet: z.string().nullable(),
  manufacturer_image_path: z.string().nullable(),
  manufacturer: manufacturer.nullable(),
});

// CONTROLLER

// SERVICE
export type GetInventoryItemOutput = z.infer<
  typeof GetInventoryItemOutputSchema
>;
