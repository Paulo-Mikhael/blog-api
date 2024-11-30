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

  if (file.bytesRead >= fileSize) {
    await fs.unlinkSync(tempPath);
    throw new ClientError("Tamanho máximo de arquivo excedido", 413);
  }

  await fs.renameSync(tempPath, newPath);

  const url = `/images/${newFileName}`;

  return { url };
}
