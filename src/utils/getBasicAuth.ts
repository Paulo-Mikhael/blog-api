import type { IncomingHttpHeaders } from "node:http";
import { ClientError } from "../errors/ClientError";

type BasicAuthData = {
  username: string;
  password: string;
};

export function getBasicAuth(
  requestHeader: IncomingHttpHeaders
): BasicAuthData | undefined {
  if (!requestHeader.authorization) return;

  // Estrutura esperada do header.authorization: "Basic base64string"
  // Transformando a string em um objeto pelo " "
  const basicAuthObject = requestHeader.authorization.split(" ");
  if (basicAuthObject[0].toLowerCase() !== "basic") return;

  const basicAuthBuffer = Buffer.from(basicAuthObject[1], "base64");
  const basicAuthString = basicAuthBuffer.toString("utf-8");

  // A estrutura da string é "username:password"
  // Transformando a string em um objeto pelo ":"
  const basicAuthData = basicAuthString.split(":");

  return {
    username: basicAuthData[0],
    password: basicAuthData[1],
  };
}
