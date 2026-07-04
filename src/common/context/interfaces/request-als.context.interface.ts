import { DepartmentSectorComplete } from "@/modules/manager/department/types/department-sector.type";

export interface RequestAlsContext {
  userId: number;
  businessUnitId: number;
  userData: DepartmentSectorComplete[]; // ou um tipo mais específico
}
