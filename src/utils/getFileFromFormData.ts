import { ClientError } from "../errors/ClientError";

export function getFileFromFormData(formData: FormData): File | null {
  const entryValue = formData.get("file");

  if (!entryValue) {
    throw new ClientError("Nenhum arquivo 'file' anexado");
  }

  if (!(entryValue instanceof File)) {
    throw new ClientError("O arquivo anexado não é um arquivo válido");
  }

  return entryValue;
}
