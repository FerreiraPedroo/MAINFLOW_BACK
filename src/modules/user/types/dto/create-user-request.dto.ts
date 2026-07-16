export interface CreateUserRequest {
  file?: Express.Multer.File;
  email: string;
  password: string;
  name: string;
  birthDate?: string;
  photo?: string;
}
