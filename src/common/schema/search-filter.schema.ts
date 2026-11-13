import { z } from "zod";

export const SearchFilterSchema = z.object({
  search: z.string().optional(),
});

export type SearchFilter = z.infer<typeof SearchFilterSchema>;
