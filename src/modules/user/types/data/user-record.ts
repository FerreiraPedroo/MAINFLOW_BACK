import { Prisma } from "@prisma/client";

export type UserRecord = Prisma.UserGetPayload<{
  include: {
    business_unit: true;
    user_session: true;
  };
}>;
