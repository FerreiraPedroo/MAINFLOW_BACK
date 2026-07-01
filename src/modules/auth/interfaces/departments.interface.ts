export type AuthDepartmentSectorData = {
  id: number;
  title: string;
  url: string;
  icon: string | null;
  sector: Sector[];
  process_item: ProcessItem[];
};

type Sector = {
  id: number;
  department_id: number;
  title: string;
  icon: string | null;
  process_item: ProcessItem[];
};

type ProcessItem = {
  id: number;
  department_id: number;
  sector_id: number | null;
  title: string;
  url: string;
  icon: string | null;
};
