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
      itens: {
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
