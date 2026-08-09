import { UserActivityData } from "@/modules/user/contracts";

export interface LocalStorageContextData {
  user_id: number;
  business_unit_id: number;
  userActivities: UserActivityData[]; // ou um tipo mais específico
  tx?: any;
}
