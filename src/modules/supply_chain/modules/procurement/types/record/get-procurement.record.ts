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
      items: {
        include: {
          item: {
            include: {
              manufacturer: true;
            };
          };
        };
      };
    };
  }>
>;
