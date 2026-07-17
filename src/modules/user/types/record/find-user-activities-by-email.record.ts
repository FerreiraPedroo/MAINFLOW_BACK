import { Prisma } from "@prisma/client";

export type UserActivityRecord = Prisma.UserActivityGetPayload<{
  include: {
    department: true;
    sector: true;
    activity: true;
  };
}>;
