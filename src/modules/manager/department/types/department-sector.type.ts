import { Prisma } from "@prisma/client";

export type DepartmentSectorComplete = Prisma.DepartmentSectorGetPayload<{
  include: { department: true; sector: true; process_item: true };
}>;
