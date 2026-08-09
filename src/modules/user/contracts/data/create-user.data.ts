export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  birth_date?: Date | null;
  photo: string | null;
}
