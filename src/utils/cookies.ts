import type { CookiesPayload } from "../types/CookiesPayload";
import type { FastifyReply, FastifyRequest } from "fastify";
import { cookieOptions } from "../data/cookieOptions";
import dayjs from "dayjs";
import z from "zod";
import { ClientError } from "../errors/ClientError";
import { getFromSafeString } from "./getFromSafeString";

const userEmailCookieName = "userEmail";
const sectionIdCookieName = "sectionId";
const passwordCodeCookieName = "passCode";

export const cookies = {
  get: getCookies,
  [userEmailCookieName]: {
    remove: removeCookie(userEmailCookieName),
    set: setCookie(userEmailCookieName),
  },
  [sectionIdCookieName]: {
    remove: removeCookie(sectionIdCookieName),
    set: setCookie(sectionIdCookieName),
  },
  [passwordCodeCookieName]: {
    remove: removeCookie(passwordCodeCookieName),
    set: setCookie(passwordCodeCookieName, dayjs().add(5, "minutes").toDate()),
  },
};

function removeCookie(cookieName: string) {
  return (reply: FastifyReply) => {
    // Define o cookie para expirar no momento atual
    return reply.setCookie(cookieName, "", {
      ...cookieOptions,
      expires: new Date(0),
    });
  };
}
function setCookie(cookieName: string, limitDate?: Date) {
  let expires = limitDate;
  if (!expires) {
    expires = dayjs().add(1, "day").toDate(); // Expira em 24 horas
  }

  return (reply: FastifyReply, value: string) => {
    return reply.setCookie(cookieName, value, {
      ...cookieOptions,
      expires,
    });
  };
}
function getCookies(request: FastifyRequest): CookiesPayload {
  const cookiesSchema = z.object({
    userEmail: z
      .string({ message: "Nenhum email de usuário encontrado nos cookies" })
      .email(),
    sectionId: z.string({
      message: "Nenhum id de sessão encontrado nos cookies",
    }),
    passCode: z.string().optional(),
  });
  const requestCookies = request.cookies;

  try {
    // Se o formato dos cookies não for válido, é tratado como se não houvesse usuário logado
    const validatedCookies = cookiesSchema.parse(requestCookies);
    const passCodeCookie = validatedCookies.passCode;

    if (passCodeCookie) {
      return {
        ...validatedCookies,
        passCode: getFromSafeString(passCodeCookie),
      };
    }

    return validatedCookies;
  } catch (error) {
    console.error(error);
    throw new ClientError("Nenhum usuário logado", 404);
  }
}
