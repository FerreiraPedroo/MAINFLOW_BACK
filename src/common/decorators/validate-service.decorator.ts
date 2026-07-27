import {
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
import * as z from "zod";

export interface ValidateServiceOptions {
  input?: z.ZodType;
  output?: z.ZodType;
}

export function ValidateService(options: ValidateServiceOptions) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any) {
      let validateArgs;

      // Se tiver validado de entrada.
      if (options.input) {
        console.log("----------------------------------------------");
        console.log({ propertyKey, args });
        const inputResult = options.input.safeParse(args);
        console.log({ propertyKey, inputResult });

        if (!inputResult.success) {
          console.log({ inputResult });
          throw new BadRequestException({
            message: `Erro de validação.`,
          });
        }

        validateArgs = inputResult.data;
      } else {
        // Se não tiver validador de entrada passa o argumento original;
        validateArgs = args;
      }
      const result = await originalMethod.apply(this, validateArgs);

      // Se tiver validador de saida, retorna os dados validados.
      if (options.output) {
        const outputResult = options.output.safeParse(result);

        if (!outputResult.success) {
          console.log({ outputResult });
          throw new InternalServerErrorException({
            message: `Erro interno de validação`,
          });
        }

        return outputResult.data;
      }
      // Se não tiver validador de saida devolve sem validar.
      return result;
    };

    return descriptor;
  };
}
