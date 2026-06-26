import { ConflictException, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

export function handlePrismaError(error: unknown, message: string = ""): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        throw new ConflictException("Registro duplicado.");

      case "P2025":
        throw new NotFoundException("Registro não encontrado.");
    }
  }

  throw error;
}
