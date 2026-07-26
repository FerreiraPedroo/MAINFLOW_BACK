import { Prisma } from "@prisma/client";

export type GetAllocationsMonthRecord = Prisma.ProjectAllocationGetPayload<{
  include: {
    people: true;
  };
}>;
