import fs from "node:fs";
import { pipeline } from "node:stream/promises";
import { getFileDirectoryConfig } from "./getFileDirectoryConfigs";
import { ClientError } from "../errors/ClientError";
import type { MultipartFile } from "@fastify/multipart";
import { appDomain } from "../data/app_domain";

export async function createOrDeleteFile(fastifyFile: MultipartFile): Promise<{
  url: string;
}> {
  const { tempPath, newPath, newFileName } =
    getFileDirectoryConfig(fastifyFile);

  // console.log(`Bytes lidos antes de criar o arquivo: ${fastifyFile.file.bytesRead}`);
  await pipeline(fastifyFile.file, fs.createWriteStream(tempPath));
  // console.log(`Bytes lidos depois de criar o arquivo: ${fastifyFile.file.bytesRead}`);

  // Só é possível comparar o tamanho real do arquivo depois de criado
  if (fastifyFile.file.bytesRead >= 1570000) {
    fs.unlinkSync(tempPath); // Deleta o arquivo
    throw new ClientError("Tamanho máximo de arquivo excedido", 413);
  }

  fs.renameSync(tempPath, newPath);

  const url = `${appDomain}/images/${newFileName}`;

  return { url };
}
