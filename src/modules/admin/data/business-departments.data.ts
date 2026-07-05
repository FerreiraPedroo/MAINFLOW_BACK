import { Prisma } from "@prisma/client";

export type BusinessDepartmentData = Prisma.BusinessUnitDepartmentGetPayload<{
  include: { department: true; sector: true; process_item: true };
}>;
