import type { UserTokenPayload } from "../types/UserTokenPayload";
import type { FastifyRequest } from "fastify";
import type { Time } from "../types/Time";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import z from "zod";
import { ClientError } from "../errors/ClientError";
import { getUserOrThrow } from "./getUserOrThrow";
import { cookies } from "./cookies";

export const jsonWebToken = {
  create: createJsonToken,
  verify: verifyJsonToken,
  verifyExistentUser,
};

const userPayloadSchema = z.object({
  userId: z.string({
    message: "É preciso informar o id do usuário em um token JWT",
  }),
  sectionId: z.string({
    message: "É preciso informar o id da sessão em um token JWT",
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
  payload: UserTokenPayload,
  time: Time = { hours: "24h" }
): { token: string } {
  const parsedPayload = userPayloadSchema.parse(payload);

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
  const token = jwt.sign(parsedPayload, secretKey, options);

  return { token };
}

async function verifyJsonToken(
  request: FastifyRequest,
  unauthorizedMessage?: string
) {
  let message: string;
  if (!unauthorizedMessage) {
    message = "Bearer Token inexistente no header da requisição";
  } else {
    message = unauthorizedMessage;
  }

  const requestAuthorization = request.headers.authorization;
  // Separa a string pelo espaço para obter o tipo de autorização no índice 0 e o token no índice 1 (caso seja Bearer Token)
  const authorizationStringObject = requestAuthorization?.split(" ");
  // Se não houver nenhuma autorização do tipo Bearer
  if (
    !authorizationStringObject ||
    !authorizationStringObject[0].toLowerCase().includes("bearer")
  ) {
    throw new JsonWebTokenError(message);
  }

  const requestCookies = request.cookies;
  // Nos cookies está o email do usuário logado
  const cookieUserEmail = requestCookies.userEmail;
  if (!cookieUserEmail) {
    throw new JsonWebTokenError("Nenhum usuário logado");
  }

  const secretKey = jwtSecretKey();
  const jwtToken = authorizationStringObject[1];

  const payload = jwt.verify(jwtToken, secretKey);
  const parsedPayload = userPayloadSchema.parse(payload);

  const actualSectionId = cookies.get(request).sectionId;
  if (parsedPayload.sectionId !== actualSectionId) {
    throw new JsonWebTokenError("Uma nova sessão foi iniciada.");
  }

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

  throw new ClientError(
    "Já existe uma sessão com este usuário, faça um 'relogin' ou inicie uma sessão com outro usuário",
    403
  );
}
