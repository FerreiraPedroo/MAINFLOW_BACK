import { Prisma } from "@prisma/client";

export type ProcessModelData = Prisma.ProcessModelGetPayload<{
  include: {
    process_steps_models: true;
  };
}>;
