export interface CreateBuildingRequest {
  zone: string;
  type: string;
  short_address: string;
  full_address: string;
  map_google?: string;
  coordinate?: string;
  photo?: string;
  status: string;
}
