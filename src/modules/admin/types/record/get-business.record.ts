import { Prisma } from "@prisma/client";

export type GetBusinessByIdRecord = Prisma.BusinessUnitGetPayload<{
  include: {
    address: true;
  };
}>;
