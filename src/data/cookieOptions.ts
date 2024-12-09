import type { CookieSerializeOptions } from "@fastify/cookie";

export const cookieOptions: CookieSerializeOptions = {
  path: "/",
  httpOnly: true,
  secure: false, // Usar `true` em produção (HTTPS)
  sameSite: "lax",
};
