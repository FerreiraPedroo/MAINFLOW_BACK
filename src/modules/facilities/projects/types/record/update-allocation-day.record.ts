import { Prisma } from "@prisma/client";

export type UpdateAllocationDayRecord = Prisma.ProjectAllocationGetPayload<{
  include: {
    people: true;
  };
}>;
