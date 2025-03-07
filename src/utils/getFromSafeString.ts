export function getFromSafeString(safeString: string) {
  return Buffer.from(safeString, "base64").toString("utf-8");
}
