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
  address: {
    short_address: string;
  };
}
