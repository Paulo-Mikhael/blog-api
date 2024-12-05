import type { MultipartFile } from "@fastify/multipart";
import z from "zod";
import { ClientError } from "../errors/ClientError";
import { validateFileType } from "../utils/validateFileType";
import { createOrDeleteFile } from "../utils/createOrDeleteFile";

export class RequestService {
  public readonly requiredMessage = "Propriedade inválida ou inexistente";
  public readonly minLengthMessage = (minNumber = 1) => {
    return `A propriedade deve ter pelo menos ${minNumber} caractere`;
  };
  public readonly maxLengthMessage = (maxNumber: number) => {
    return `A propriedade não pode passar de ${maxNumber} caracteres`;
  };

  getParamId(params: unknown): { id: string } {
    const idParamsSchema = z.object({ id: z.string() });

    const validatedParams = idParamsSchema.parse(params);

    return { id: validatedParams.id };
  }
  getQueryTakeSkip(query: unknown) {
    let take = 50;
    let skip = 0;
    const takeSkipQuerySchema = z.object({
      take: z.string().optional(),
      skip: z.string().optional(),
    });

    if (!takeSkipQuerySchema.parse(query)) return { take, skip };

    const validatedQuery = takeSkipQuerySchema.parse(query);
    const queryTake = Number(validatedQuery.take);
    const querySkip = Number(validatedQuery.skip);

    if (validatedQuery.take && queryTake > 0) {
      take = queryTake;
    }
    if (validatedQuery.skip && querySkip > 0) {
      skip = querySkip;
    }

    return {
      take,
      skip,
    };
  }
  async uploadFile(
    fastifyMultipartFile: MultipartFile | undefined
  ): Promise<{ url: string }> {
    if (!fastifyMultipartFile) {
      throw new ClientError("Nenhum arquivo anexado", 400);
    }
    const file = fastifyMultipartFile.file;
    if (!file || file.bytesRead <= 0) {
      throw new ClientError("Nenhum arquivo anexado", 400);
    }
    const fileType = fastifyMultipartFile.mimetype.replace("image/", "");
    if (validateFileType(fileType) === false) {
      throw new ClientError("Insira um arquivo de imagem", 415);
    }

    const { url } = await createOrDeleteFile(fastifyMultipartFile);

    return { url };
  }
  getObjectFromRequest(request: unknown, properties: string[]) {
    let zObjectProperties: { [x: string]: z.ZodOptional<z.ZodString> } = {};
    for (let i = 0; i < properties.length; i++) {
      const property = properties[i];
      zObjectProperties = {
        ...zObjectProperties,
        [property]: z.string().optional(),
      };
    }
    const querySchema = z.object(zObjectProperties);

    const validatedQuery = querySchema.parse(request);

    return validatedQuery;
  }
}
