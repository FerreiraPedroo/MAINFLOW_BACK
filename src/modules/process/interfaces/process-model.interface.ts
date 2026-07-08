import { Prisma } from "@prisma/client";

export type ProcessModelComplete = Prisma.ProcessModelGetPayload<{
  include: {
    process_item: true;
  };
}>;
