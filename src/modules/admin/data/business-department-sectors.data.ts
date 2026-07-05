export type BusinessDepartmentSectorsData = {
  id: number;
  title: string;
  url: string;
  icon: string | null;
  itemsList: (SectorItem | ProcessItem)[];
};

export type SectorItem = {
  id: number;
  department_id: number;
  title: string;
  icon: string | null;
  process_item: ProcessItem[];
};

export type ProcessItem = {
  id: number;
  department_id: number;
  sector_id: number | null;
  title: string;
  url: string;
  icon: string | null;
};
