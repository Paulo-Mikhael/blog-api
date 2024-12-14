import type { FastifyRequest } from "fastify";
import type { Time } from "../types/Time";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import z from "zod";
import { ClientError } from "../errors/ClientError";
import { getUserOrThrow } from "./getUserOrThrow";

export const jsonWebToken = {
  create: createJsonToken,
  verify: verifyJsonToken,
  verifyExistentUser,
};

const userPayloadSchema = z.object({
  userId: z.string({
    message: "É preciso informar o id do usuário em um token JWT",
  }),
});

function jwtSecretKey(): string {
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    throw new Error("Erro ao pegar chave secreta para criar Json Web Token");
  }

  return secretKey;
}

function createJsonToken(
  payload: { [x: string]: any },
  time: Time = { hours: "24h" }
): { token: string } {
  userPayloadSchema.parse(payload);

  const hours = time.hours;
  const seconds = time.seconds;
  let expiresIn: string | number = 0;

  // Para caso a função receber um objeto vazio
  if (!hours && !seconds) expiresIn = "24h";

  if (seconds) expiresIn = seconds;
  if (hours) expiresIn = hours;

  const secretKey = jwtSecretKey();
  const options = {
    expiresIn,
  };
  const token = jwt.sign(payload, secretKey, options);

  return { token };
}

async function verifyJsonToken(request: FastifyRequest) {
  const requestAuthorization = request.headers.authorization;
  const requestCookies = request.cookies;
  // Nos cookies está o email do usuário logado
  const cookieUserEmail = requestCookies.userEmail;

  if (!cookieUserEmail) {
    throw new ClientError("Nenhum usuário logado", 400);
  }

  const secretKey = jwtSecretKey();
  if (
    !requestAuthorization ||
    !requestAuthorization.toLowerCase().includes("bearer")
  ) {
    throw new JsonWebTokenError(
      "Bearer Token inexistente no header da requisição"
    );
  }

  // Apaga o "Bearer" e tira os espaços
  const jwtToken = requestAuthorization.substring(6).trim();

  const payload = jwt.verify(jwtToken, secretKey);
  const parsedPayload = userPayloadSchema.parse(payload);
  const user = await getUserOrThrow(parsedPayload.userId);

  // Se o email extraído do token JWT for diferente do usuário logado
  if (user.email !== cookieUserEmail) {
    throw new JsonWebTokenError(
      "Usuário negado. Insira o Bearer Token correto ou faça login novamente"
    );
  }

  return parsedPayload;
}

function verifyExistentUser(request: FastifyRequest, bodyEmail: string) {
  const requestCookies = request.cookies;
  const loggedUserEmail = requestCookies.userEmail;

  // Se não tiver usuário logado
  if (!loggedUserEmail) {
    return;
  }

  // Se não for o usuário atual
  if (loggedUserEmail !== bodyEmail) {
    return;
  }

  throw new ClientError("Usuário já está logado", 400);
}
