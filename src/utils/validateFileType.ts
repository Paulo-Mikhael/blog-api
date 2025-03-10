import { imageFileExtensions } from "../data/image_file_extensions";

export function validateFileType(fileType: string) {
  const normalizedFileExtension = fileType;

  const fileTypeExtension = imageFileExtensions.find((extension) => {
    return extension === normalizedFileExtension;
  });

  if (fileTypeExtension) {
    return true;
  }

  return false;
}
