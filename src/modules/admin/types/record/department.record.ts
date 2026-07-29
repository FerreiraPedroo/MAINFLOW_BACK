import { Prisma } from "@prisma/client";

export type DepartmentRecord = Prisma.DepartmentGetPayload<{
  include: {
    sectors: true;
    activities: true;
  };
}>;
