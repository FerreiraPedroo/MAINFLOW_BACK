export type RemoveProcessToBusinessRequest = {
  businessId: number;
  processItems: {
    departmentId: number;
    sectorId: number | null;
    processItemId: number;
  }[];
};
