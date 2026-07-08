import { Prisma } from "@prisma/client";

export type BusinessProcessData = Prisma.BusinessUnitProcessGetPayload<{
  include: {
    department: true;
    sector: true;
    process_item: true;
  };
}>;
