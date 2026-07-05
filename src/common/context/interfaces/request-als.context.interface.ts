import { UserDepartmentSectorComplete } from "@/modules/manager/department/types/department-sector.type";

export interface RequestAlsContext {
  userId: number;
  businessUnitId: number;
  userData: UserDepartmentSectorComplete[]; // ou um tipo mais específico
}
