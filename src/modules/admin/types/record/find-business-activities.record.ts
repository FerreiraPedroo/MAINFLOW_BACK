import { Prisma } from "@prisma/client";

export type FindBusinessActivitiesRecord =
  Prisma.BusinessUnitActivityGetPayload<{
    include: {
      department: true;
      sector: true;
      activity: true;
    };
  }>;
