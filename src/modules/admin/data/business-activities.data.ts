export type BusinessActivitiesData = {
  id: number;
  title: string;
  url: string;
  icon: string | null;
  activityList: (SectorItem | Activity)[];
};

export type SectorItem = {
  id: number;
  department_id: number;
  title: string;
  icon: string | null;
  activities: Activity[];
};

export type Activity = {
  id: number;
  department_id: number;
  sector_id: number | null;
  title: string;
  url: string;
  icon: string | null;
};
