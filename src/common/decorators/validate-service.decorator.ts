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

    descriptor.value = async function (...args: any[]) {
      let validateArgs;

      if (options.input) {
        const inputResult = options.input.safeParse(args);

        if (!inputResult.success) {
          throw new BadRequestException({
            message: `Erro de validação.`,
          });
        }

        validateArgs = inputResult.data;
      } else {
        validateArgs = args;
      }

      /**
       * PARA TRANSFORMAR EM UM VALIDADOR DE SERVICE, PODE ADICIONAR A OPÇÃO
       * options?: "SERVICE"
       * E VERIFICAR SE HOUVER A OPÇÃO, VERIFICA SE O ARGUMENTO É UM ARRAY
       * SE NÃO FOR CRIA UM COM OS DADOS DO ARGUMENTO.
       */
      const result = await originalMethod.apply(this, validateArgs);

      // Se tiver validador de saida, retorna os dados validados.
      if (options.output) {
        const outputResult = options.output.safeParse(result);

        if (!outputResult.success) {
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
