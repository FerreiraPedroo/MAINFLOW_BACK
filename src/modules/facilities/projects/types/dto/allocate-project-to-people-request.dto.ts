export interface AllocatePeopleToProjectRequest {
  projectId: number;
  peopleId: number;
  assignDate: string;
  startHour: string;
  endHour: string;
}
