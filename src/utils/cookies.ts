import type { FastifyReply, FastifyRequest } from "fastify";
import { cookieOptions } from "../data/cookieOptions";
import dayjs from "dayjs";
import z from "zod";
import { ClientError } from "../errors/ClientError";

const userEmailCookieName = "userEmail";

export const cookies = {
  [userEmailCookieName]: {
    remove: removeUserEmailCookie,
    set: setUserEmailCookie,
    get: getUserEmailCookie,
  },
};

function removeUserEmailCookie(reply: FastifyReply) {
  // Define o cookie "userEmailCookieName" para expirar no momento atual
  return reply.setCookie(userEmailCookieName, "", {
    ...cookieOptions,
    expires: new Date(0),
  });
}
function setUserEmailCookie(reply: FastifyReply, userEmail: string) {
  return reply.setCookie(userEmailCookieName, userEmail, {
    ...cookieOptions,
    expires: dayjs().add(1, "day").toDate(), // Expira em 24 horas
  });
}
function getUserEmailCookie(request: FastifyRequest): { userEmail: string } {
  const cookiesSchema = z.object({
    userEmail: z
      .string({ message: "Nenhum email de usuário encontrado nos cookies" })
      .email(),
  });
  const requestCookies = request.cookies;

  try {
    const validatedCookies = cookiesSchema.parse(requestCookies);

    return { userEmail: validatedCookies.userEmail };
  } catch (error) {
    console.error(error);
    throw new ClientError("Nenhum usuário logado");
  }
}
