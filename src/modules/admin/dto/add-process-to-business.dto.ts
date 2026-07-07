export type AddProcessToBusinessRequest = {
  businessId: number;
  processItems: {
    departmentId: number;
    sectorId: number | null;
    processItemId: number;
  }[];
};
