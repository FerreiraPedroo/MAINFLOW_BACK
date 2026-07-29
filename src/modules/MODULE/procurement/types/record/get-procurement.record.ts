import { Prisma } from "@prisma/client";

type Prettify<T> =
  | ({
      [K in keyof T]: T[K];
    } & {})
  | null;

export type GetProcurementRecord = Prettify<
  Prisma.ProcurementGetPayload<{
    include: {
      cost_center: true;
      project: true;
      inventory_items: {
        include: {
          inventory_item: {
            include: {
              manufacturer: true;
            };
          };
        };
      };
    };
  }>
>;
