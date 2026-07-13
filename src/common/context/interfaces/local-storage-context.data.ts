import { UserActivityData } from "@/modules/user/interfaces/data/user-activity.data";

export interface LocaStorageContextData {
  userId: number;
  businessUnitId: number;
  userActivities: UserActivityData[]; // ou um tipo mais específico
}
