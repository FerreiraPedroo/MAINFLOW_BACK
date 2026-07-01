import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

@Injectable()
export class EncryptService {
  private readonly saltRounds = 10;

  constructor() {}

  async generateHash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }
  async compareHash(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
