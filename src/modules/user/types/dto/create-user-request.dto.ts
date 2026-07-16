export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  birthDate?: string;
  photo?: string;
}
