import { Prisma } from "@prisma/client";

export type GetBuildingRecord = Prisma.BuildingGetPayload<{
  include: {
    _count: {
      select: {
        localizations: true;
        building_lease_contracts: true;
      };
    };
  };
}>;
