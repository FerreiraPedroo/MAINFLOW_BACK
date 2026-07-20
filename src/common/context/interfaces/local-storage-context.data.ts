import { UserActivityData } from "@/modules/user/types/data/user-activity.data";

export interface LocalStorageContextData {
  userId: number;
  businessUnitId: number;
  userActivities: UserActivityData[]; // ou um tipo mais específico
}
