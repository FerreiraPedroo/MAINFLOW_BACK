export interface DepartmentData {
  id: number;
  title: string;
  url: string;
  icon: string | null;
  sector: SectorItem | null;
  process_item: ProcessItem;
}

export interface SectorItem {
  id: number;
  department_id: number;
  title: string;
  icon: string | null;
}

export interface ProcessItem {
  id: number;
  department_id: number;
  sector_id: number | null;
  title: string;
  url: string;
  icon: string | null;
}
