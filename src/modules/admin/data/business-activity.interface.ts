import { Prisma } from "@prisma/client";

export type BusinessActivity = Prisma.BusinessUnitActivityGetPayload<{
  include: {
    department: true;
    sector: true;
    activity: true;
  };
}>;
