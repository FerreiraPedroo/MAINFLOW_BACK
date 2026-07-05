import { Prisma } from "@prisma/client";

export type UserDepartmentSectorComplete =
  Prisma.UserDepartmentSectorGetPayload<{
    include: { department: true; sector: true; process_item: true };
  }>;
