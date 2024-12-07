import fs from "node:fs";
import { pipeline } from "node:stream/promises";
import type { MultipartFile } from "@fastify/multipart";
import { getFileDirectoryConfig } from "./getFileDirectoryConfigs";
import { ClientError } from "../errors/ClientError";
import { fileSize } from "../server";

export async function createOrDeleteFile(
  fastifyMultipartFile: MultipartFile
): Promise<{
  url: string;
}> {
  const { tempPath, newPath, newFileName } =
    getFileDirectoryConfig(fastifyMultipartFile);

  const file = fastifyMultipartFile.file;

  await pipeline(file, fs.createWriteStream(tempPath));

  // Só é possível comparar o tamanho real do arquivo depois de criado
  // O FastifyMultipart só permite ler a quantidade de bytes estabelecida, então se for igual quer dizer que o arquivo passou do limite
  if (file.bytesRead >= fileSize) {
    fs.unlinkSync(tempPath); // Deleta o arquivo
    throw new ClientError("Tamanho máximo de arquivo excedido", 413);
  }

  fs.renameSync(tempPath, newPath);

  const url = `/images/${newFileName}`;

  return { url };
}
