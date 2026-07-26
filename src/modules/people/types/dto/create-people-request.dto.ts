export interface CreatePeopleRequest {
  name: string;
  birth_date: string;
  status: string;
  registration_number?: string;
  photo?: string;
  sex?: string;
  hire_date?: string;
  termination_date?: string;
}
