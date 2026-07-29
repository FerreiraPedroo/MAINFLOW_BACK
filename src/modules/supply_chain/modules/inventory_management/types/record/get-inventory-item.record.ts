import { Prisma } from "@prisma/client";

type Prettify<T> =
  | ({
      [K in keyof T]: T[K];
    } & {})
  | null;

export type GetInventoryItemRecord = Prettify<
  Prisma.InventoryItemGetPayload<{
    include: {
      manufacturer: true;
    };
  }>
>;
