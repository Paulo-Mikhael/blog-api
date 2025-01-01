export function getFileType(mimetype: string) {
  return mimetype.replace("image/", "").replace("x-icon", "ico");
}
