import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import * as fs from "fs/promises";
import path from "path";

@Injectable()
export class FileService {
  constructor() {}

  async fileSave(
    file: Express.Multer.File,
    destination: string,
    user?: string,
  ): Promise<string> {
    if (!destination) {
      throw new InternalServerErrorException(
        "Erro interno no caminho do arquivo.",
      );
    }

    if (!file) {
      throw new BadRequestException("Nenhum arquivo encontrado");
    }

    const finalFolder = path.resolve(`./storage/${destination}`);
    const fileName = `${Date.now()}-${file.originalname}`;
    const finalPath = path.join(finalFolder, fileName);

    try {
      await fs.mkdir(finalFolder, { recursive: true });

      await fs.rename(file.path, finalPath);

      return `./storage/${destination}/${fileName}`;
    } catch (error) {
      await fs.unlink(file.path);

      throw new BadRequestException("Erro ao processar e mover o arquivo.");
    }
  }

  async removeFile(filePath: string) {
    try {
      await fs.unlink(filePath);
    } catch (error) {}
    return true;
  }
}
