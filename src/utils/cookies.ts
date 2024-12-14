import type { FastifyReply } from "fastify";
import { cookieOptions } from "../data/cookieOptions";
import dayjs from "dayjs";

export const cookies = {
  userEmail: {
    remove: removeUserEmailCookie,
    set: setUserEmailCookie,
  },
};
const userEmailCookieName = "userEmail";

function removeUserEmailCookie(reply: FastifyReply) {
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
