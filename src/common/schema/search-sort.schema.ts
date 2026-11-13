import z from "zod";

export const SearchSortSchema = z.object({
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type SearchSortSchema = z.infer<typeof SearchSortSchema>;
