import type { MultipartFile } from "@fastify/multipart";
import z from "zod";
import { ClientError } from "../errors/ClientError";
import { validateFileType } from "../utils/validateFileType";
import { createOrDeleteFile } from "../utils/createOrDeleteFile";
import { getFileType } from "../utils/getFileType";

export class RequestService {
  public readonly requiredMessage = "Propriedade inválida ou inexistente";
  public readonly minLengthMessage = (minNumber = 1) => {
    return `A propriedade deve ter pelo menos ${minNumber} caractere`;
  };
  public readonly maxLengthMessage = (maxNumber: number) => {
    return `A propriedade não pode passar de ${maxNumber} caracteres`;
  };

  getParamId(params: unknown): { id: string } {
    const idParamsSchema = z.object({
      id: z.string({
        message: "Parâmetro ':id' não encontrado na requisição",
      }),
    });

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
    fastifyFile: MultipartFile | undefined
  ): Promise<{ url: string }> {
    const file = fastifyFile?.file;
    if (!file) {
      throw new ClientError("Nenhum arquivo anexado", 400);
    }

    const fileType = getFileType(fastifyFile.mimetype);
    if (validateFileType(fileType) === false) {
      throw new ClientError("Insira um arquivo de imagem", 415);
    }

    const { url } = await createOrDeleteFile(fastifyFile);

    return { url };
  }

  //Retorna um objeto contendo propriedades com os nomes especificados no array de string
  getObjectFromRequest(requestParams: unknown, properties: string[]) {
    if (typeof requestParams !== "object") {
      return {};
    }
    // Variável que vai guardar as propriedades como um objeto ZOD
    let zObjectProperties: { [x: string]: z.ZodOptional<z.ZodString> } = {};
    // Itera as propriedades passadas por parâmetro, e coloca cada uma na variável
    for (let i = 0; i < properties.length; i++) {
      const property = properties[i];
      // Montando o objeto ZOD
      zObjectProperties = {
        ...zObjectProperties,
        [property]: z.string().optional(),
      };
    }
    // Objeto ZOD com as propriedades
    const zodObject = z.object(zObjectProperties);
    // Objeto normal com as propriedades
    const requestObject = zodObject.parse(requestParams);

    // Itera as propriedades passadas por parâmetro e confere se todas elas estão no objeto
    /* As propriedades a serem retornadas são especificadas pelo servidor, se todas as propriedades
    não estiverem no objeto, o nome da propriedade está errada ou não existe. Certificar que o parâmetro
    que a rota pede (rota/:parâmetro), é o mesmo da propriedade especificada */
    for (let i = 0; i < properties.length; i++) {
      const property = properties[i];

      if (!(property in requestObject)) {
        // Lança uma mensagem de erro com o nome da propriedade que não foi possível extrair do parâmetro "request"
        throw new Error(
          `Não foi possível extrair a propriedade "${property}" da requisição`
        );
      }
    }

    return requestObject;
  }

  normalizeText(text: string) {
    return text
      .normalize("NFD") // Remove acentos e caracteres especiais
      .replace(/[\u0300-\u036f]/g, "") // Remove marcas diacríticas
      .trim(); // Remove espaços ou hifens extras no início e no fim
  }
}
