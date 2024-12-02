import type { MultipartFile } from "@fastify/multipart";
import { v4 as uuidV4 } from "uuid";

interface FileDirectoryConfigReturn {
  tempPath: string;
  newPath: string;
  newFileName: string;
}

export function getFileDirectoryConfig(
  fastifyMultipartFile: MultipartFile
): FileDirectoryConfigReturn {
  const folder = "uploads";
  const fileType = fastifyMultipartFile.mimetype.replace("image/", "");

  const newFileName = `${uuidV4()}.${fileType}`;

  const tempPath = `${folder}/${fastifyMultipartFile.filename}`;
  const newPath = `${folder}/${newFileName}`;

  return {
    tempPath,
    newPath,
    newFileName,
  };
}
