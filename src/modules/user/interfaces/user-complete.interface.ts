import { Prisma } from "@prisma/client";

export type UserComplete = Prisma.UserGetPayload<{
  include: {
    business_unit: true;
    user_data: true;
    user_session: true;
  };
}>;
