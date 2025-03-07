export function getSafeString(string: string): string {
  return Buffer.from(string).toString("base64");
}
