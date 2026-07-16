import { UserActivityData } from "@/modules/user/types/data/user-activity.data";

export interface LocaStorageContextData {
  userId: number;
  businessUnitId: number;
  userActivities: UserActivityData[]; // ou um tipo mais específico
}
