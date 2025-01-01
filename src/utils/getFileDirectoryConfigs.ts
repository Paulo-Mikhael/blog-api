import type { MultipartFile } from "@fastify/multipart";
import { v4 as uuidV4 } from "uuid";

interface FileDirectoryConfigReturn {
  tempPath: string;
  newPath: string;
  newFileName: string;
}

export function getFileDirectoryConfig(file: File): FileDirectoryConfigReturn {
  const folder = "uploads";
  const fileType = file.type.replace("image/", "");

  const newFileName = `${uuidV4()}.${fileType}`;

  const tempPath = `${folder}/${file.name}`;
  const newPath = `${folder}/${newFileName}`;

  return {
    tempPath,
    newPath,
    newFileName,
  };
}
