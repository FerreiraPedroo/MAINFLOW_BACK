import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from "@nestjs/common";
import { Express } from "express";

const FILE_TYPES = {
  img: /^image\/(png|jpeg|jpg)$/,
  pdf: /^application\/pdf$/,
  doc: /(msword|wordprocessingml|doc|docx)$/,
};

@Injectable()
export class UploadFilePipe implements PipeTransform {
  constructor(
    private readonly config: {
      fileType: keyof typeof FILE_TYPES;
      fileSize: number;
      fileRequired: boolean;
    },
  ) {}

  transform(file: Express.Multer.File, metadata: ArgumentMetadata) {
    // 1. Valida obrigatoriedade
    if (!file && this.config.fileRequired) {
      throw new BadRequestException("O arquivo é obrigatório.");
    }

    // Se não for obrigatório e não foi enviado, segue o fluxo normalmente
    if (!file) return file;

    // 2. Valida o tipo do arquivo (mimetype)
    const regex = FILE_TYPES[this.config.fileType];
    if (!regex.test(file.mimetype)) {
      throw new BadRequestException("O tipo do arquivo não é válido.");
    }

    // 3. Valida o tamanho máximo
    if (file.size > this.config.fileSize) {
      const maxKb = (this.config.fileSize / 1024).toFixed(0);
      throw new BadRequestException(
        `Tamanho do arquivo excedido, limite máximo: ${maxKb}KB`,
      );
    }

    return file;
  }
}

// Helper para manter exatamente a mesma sintaxe de chamada que você já usa no Controller
export const uploadFilePipe = (options: {
  fileType: keyof typeof FILE_TYPES;
  fileSize: number;
  fileRequired: boolean;
}) => new UploadFilePipe(options);
