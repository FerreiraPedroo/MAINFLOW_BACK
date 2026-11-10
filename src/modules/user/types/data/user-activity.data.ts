import { Prisma } from "@prisma/client";

export type UserActivityData = Prisma.UserActivityGetPayload<{
  include: { department: true; sector: true; activity: true };
}>;
