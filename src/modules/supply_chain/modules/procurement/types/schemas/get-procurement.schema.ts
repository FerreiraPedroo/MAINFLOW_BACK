import * as z from "zod";

const GetProcurementInput = z.coerce.number().positive();

const costCenter = z.object({
  id: z.number(),
  title: z.string(),
  status: z.string(),
  description: z.string(),
});
const project = z.object({
  id: z.number(),
  code: z.string(),
  title: z.string(),
  status: z.string(),
});
const item = z.object({
  title: z.string(),
  code: z.string(),
  unit_measure: z.string(),
  category: z.string(),
  sub_category: z.string(),
  type: z.string(),
  description: z.string().nullable(),
  image_path: z.string().nullable(),
  hs_code: z.string().nullable(),
});
const items = z
  .object({
    id: z.number(),
    item_id: z.number(),
    quantity: z.number(),
    item: item,
  })
  .transform((obj) => {
    const { item, ...rest } = obj;
    return {
      ...rest,
      title: item.title,
      code: item.code,
      unit_measure: item.unit_measure,
      category: item.category,
      sub_category: item.sub_category,
      type: item.type,
      description: item.description,
      image_path: item.image_path,
      hs_code: item.hs_code,
    };
  });
const GetProcurementOutput = z.object({
  id: z.number(),
  code: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.string(),
  status: z.string(),
  send_date: z.string().nullable(),
  project: project,
  cost_center: costCenter,
  items: z.array(items),
});

// SCHEMA > For Validation Service
export const GetProcurementInputSchema = z.tuple([GetProcurementInput]);
export const GetProcurementOutputSchema = GetProcurementOutput;

// For Controller method assignature
export type GetProcurementDto = z.infer<typeof GetProcurementInput>;

// For Service method assignature
export type GetProcurementInput = GetProcurementDto;
export type GetProcurementOutput = z.infer<typeof GetProcurementOutput>;
