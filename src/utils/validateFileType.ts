export function validateFileType(fileType: string) {
  const normalizedFileExtension = fileType.startsWith(".")
    ? fileType.toLowerCase()
    : `.${fileType.toLowerCase()}`;

  const imageExtensions = [
    ".jpg", // JPEG image
    ".jpeg", // JPEG image
    ".png", // Portable Network Graphics
    ".gif", // Graphics Interchange Format
    ".bmp", // Bitmap Image File
    ".webp", // WebP image
    ".svg", // Scalable Vector Graphics
    ".tiff", // Tagged Image File Format
    ".tif", // Tagged Image File Format (alternate extension)
    ".ico", // Icon file
    ".heic", // High Efficiency Image File Format
    ".heif", // High Efficiency Image Format
    ".raw", // Raw image file (various formats, generic extension)
    ".cr2", // Canon Raw 2
    ".nef", // Nikon Electronic Format
    ".orf", // Olympus Raw Format
    ".arw", // Sony Alpha Raw
    ".rw2", // Panasonic Raw
    ".dng", // Digital Negative
    ".eps", // Encapsulated PostScript (often vector but can contain images)
  ];
  const fileTypeExtension = imageExtensions.find((extension) => {
    return extension === normalizedFileExtension;
  });

  if (fileTypeExtension) {
    return true;
  }

  return false;
}
