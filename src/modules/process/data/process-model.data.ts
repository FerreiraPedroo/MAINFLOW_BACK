import { Prisma } from "@prisma/client";

export type ProcessModelData = Prisma.ProcessModelGetPayload<{
  include: {
    process_item: true;
    process_steps_models: true;
  };
}>;
