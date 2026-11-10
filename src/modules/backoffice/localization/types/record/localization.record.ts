export interface LocalizationRecord {
  id: number;
  title: string;
  status: string;
  block: {
    title: string;
  };
  floor: {
    title: string;
  };
  space_type: {
    title: string;
  };
  building: {
    short_address: string;
  };
}
