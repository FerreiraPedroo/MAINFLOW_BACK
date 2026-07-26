import { Prisma } from "@prisma/client";

export type ProjectRecord = Prisma.ProjectGetPayload<{
  include: {
    cost_center: true;
    procurements: true;
    project_allocations: {
      include: {
        people: true;
      };
    };
  };
}> | null;
