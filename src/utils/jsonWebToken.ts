import type { Time } from "../types/Time";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import z from "zod";

export const jsonWebToken = {
  create: createJsonToken,
  verify: verifyJsonToken,
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
  time: Time = { hours: "1h" }
): { token: string } {
  userPayloadSchema.parse(payload);

  const hours = time.hours;
  const seconds = time.seconds;
  let expiresIn: string | number = 0;

  // Para caso a função receber um objeto vazio
  if (!hours && !seconds) expiresIn = "1h";

  if (seconds) expiresIn = seconds;
  if (hours) expiresIn = hours;

  const secretKey = jwtSecretKey();
  const options = {
    expiresIn,
  };
  const token = jwt.sign(payload, secretKey, options);

  return { token };
}

function verifyJsonToken(requestAuthorization: string | undefined) {
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

  return parsedPayload;
}
