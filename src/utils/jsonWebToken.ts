import type { UserTokenPayload } from "../types/UserTokenPayload";
import type { FastifyRequest } from "fastify";
import type { Time } from "../types/Time";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import z from "zod";
import { ClientError } from "../errors/ClientError";
import { getUserOrThrow } from "./getUserOrThrow";
import { cookies } from "./cookies";
import type { ResetPasswordPayload } from "../types/ResetPasswordPayload";

export const jsonWebToken = {
  create: createJsonToken,
  verifyUserPayload,
  verifyExistentUser,
  verifyResetPasswordPayload,
};

function jwtSecretKey(): string {
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    throw new Error("Erro ao pegar chave secreta para criar Json Web Token");
  }

  return secretKey;
}

function createJsonToken(
  payload: UserTokenPayload | ResetPasswordPayload,
  time: Time = { hours: "24h" }
): { token: string } {
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

function verifyJsonToken(
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

  const secretKey = jwtSecretKey();
  const jwtToken = authorizationStringObject[1];

  const payload = jwt.verify(jwtToken, secretKey);

  return { payload };
}

async function verifyUserPayload(
  request: FastifyRequest,
  unauthorizedMessage?: string
) {
  const { payload } = verifyJsonToken(request, unauthorizedMessage);
  const userPayloadSchema = z.object({
    userId: z.string({
      message: "É preciso informar o id do usuário nesse token JWT",
    }),
    sectionId: z.string({
      message: "É preciso informar o id da sessão nesse token JWT",
    }),
  });

  if (!userPayloadSchema.parse(payload)) {
    throw new JsonWebTokenError("Json inválido.");
  }

  const parsedPayload = userPayloadSchema.parse(payload);

  const actualSectionId = cookies.get(request).sectionId;
  if (parsedPayload.sectionId !== actualSectionId) {
    throw new JsonWebTokenError("Uma nova sessão foi iniciada.");
  }

  const user = await getUserOrThrow(parsedPayload.userId);

  const requestCookies = request.cookies;
  // Nos cookies está o email do usuário logado
  const cookieUserEmail = requestCookies.userEmail;
  if (!cookieUserEmail) {
    throw new JsonWebTokenError("Nenhum usuário logado");
  }
  // Se o email extraído do token JWT for diferente do usuário logado
  if (user.email !== cookieUserEmail) {
    throw new JsonWebTokenError(
      "Usuário negado. Insira o Bearer Token correto ou faça login novamente"
    );
  }

  return parsedPayload;
}

function verifyResetPasswordPayload(
  request: FastifyRequest,
  unauthorizedMessage?: string
) {
  const { payload } = verifyJsonToken(request, unauthorizedMessage);
  const resetPasswordPayloadSchema = z.object({
    resetPasswordAcess: z.boolean({
      message: "É preciso informar o valor booleano de acesso nesse token JWT",
    }),
    userEmail: z
      .string({
        message: "É preciso informar o email do usuário nesse token JWT",
      })
      .email(),
    userId: z.string({
      message: "É preciso informar o id do usuário nesse token JWT",
    }),
  });

  const parsedPayload = resetPasswordPayloadSchema.parse(payload);

  if (parsedPayload.resetPasswordAcess === false) {
    throw new JsonWebTokenError("Acesso negado");
  }

  return { userEmail: parsedPayload.userEmail, userId: parsedPayload.userId };
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
