import { Prisma } from "@prisma/client";

export type FindMaintenanceRecord = Prisma.MaintenanceGetPayload<{
  include: {
    localization: {
      include: {
        block: true;
        floor: true;
        space_type: true;
        address: true;
      };
    };
  };
}>;
