import {
  BusinessUnitProcess,
  Department,
  ProcessItem,
  Sector,
} from "@prisma/client";

export type BusinessProcessData = BusinessUnitProcess & {
  department: Department;
  sector: Sector;
  process_item: ProcessItem;
};
