import type { MultipartFile } from "@fastify/multipart";
import { v4 as uuidV4 } from "uuid";
import { getFileType } from "./getFileType";

interface FileDirectoryConfigReturn {
  tempPath: string;
  newPath: string;
  newFileName: string;
}

export function getFileDirectoryConfig(
  file: MultipartFile
): FileDirectoryConfigReturn {
  const folder = "uploads";
  const fileType = getFileType(file.mimetype);

  const newFileName = `${uuidV4()}.${fileType}`;

  const tempPath = `${folder}/${file.filename}`;
  const newPath = `${folder}/${newFileName}`;

  return {
    tempPath,
    newPath,
    newFileName,
  };
}
