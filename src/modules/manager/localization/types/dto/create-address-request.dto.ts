export interface CreateAddressRequest {
  zone: string;
  shortAddress: string;
  fullAddress: string;
  mapGoogle?: string;
  coordinate?: string;
  photo?: string;
  status: string;
}
