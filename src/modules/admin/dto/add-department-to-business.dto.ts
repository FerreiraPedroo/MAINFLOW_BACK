export type AddDepartmentToBusinessRequest = {
  businessId: number;
  departmentProcess: [
    { departmentId: number; sectorId: number | null; processItemId: number },
  ];
};
