import { UserActivityData } from "@/modules/user/types/data/user-activity.data";

export interface LocalStorageContextData {
  user_id: number;
  business_unit_id: number;
  userActivities: UserActivityData[]; // ou um tipo mais específico
  tx?: any;
}
