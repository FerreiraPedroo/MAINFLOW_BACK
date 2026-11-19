import z from "zod";

import { SearchSortSchema } from "./search-sort.schema";
import { SearchPaginationSchema } from "./search-pagination.schema";

export const SearchQuerySchema = <T extends z.ZodType>(filter: T) =>
  z.object({
    filter: filter.optional(),
    order: SearchSortSchema.optional(),
    pagination: SearchPaginationSchema.optional(),
  });
