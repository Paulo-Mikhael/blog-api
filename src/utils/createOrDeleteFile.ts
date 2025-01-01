import fs from "node:fs";
import { pipeline } from "node:stream/promises";
import { getFileDirectoryConfig } from "./getFileDirectoryConfigs";
import { ClientError } from "../errors/ClientError";
import { fileSize } from "./fastifyServices";
import { Readable } from "node:stream";

export async function createOrDeleteFile(file: File): Promise<{
  url: string;
}> {
  const { tempPath, newPath, newFileName } = getFileDirectoryConfig(file);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  console.log(`\nTamanho do arquivo antes de criado: ${buffer.length}`);

  const readableNodeStream = Readable.from(
    (async function* () {
      const reader = file.stream().getReader();
      let done = false;

      while (!done) {
        const { value, done: isDone } = await reader.read();
        if (value) {
          yield value; // Retorna o chunk
        }
        done = isDone;
      }
    })()
  );
  await pipeline(readableNodeStream, fs.createWriteStream(tempPath));

  console.log(`\nTamanho do arquivo depois de criado: ${buffer.length}`);

  // Só é possível comparar o tamanho real do arquivo depois de criado
  if (buffer.length >= fileSize) {
    fs.unlinkSync(tempPath); // Deleta o arquivo
    throw new ClientError("Tamanho máximo de arquivo excedido", 413);
  }

  fs.renameSync(tempPath, newPath);

  const url = `/images/${newFileName}`;

  return { url };
}
