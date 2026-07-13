import { Prisma } from "@prisma/client";

export type DepartmentData = Prisma.DepartmentGetPayload<{
  include: {
    sectors: true;
    activities: true;
  };
}>;
