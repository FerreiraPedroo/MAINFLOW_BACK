export type AddProcessToBusinessRequest = {
  businessId: number;
  activities: {
    departmentId: number;
    sectorId: number | null;
    activityId: number;
  }[];
};
