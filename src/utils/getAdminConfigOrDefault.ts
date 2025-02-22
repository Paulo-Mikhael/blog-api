import type { AdminConfig } from "../types/AdminConfig";
import type { SecurityObject } from "../types/SecurityObject";

type Configs = {
  tags: string[];
  security: SecurityObject | undefined;
};

// Função que muda a 'tags' e 'security' da documentação se tiver configurações de adminstrador
export function getAdminConfigOrDefault(
  defaultTags: string[],
  defaultSecurity: SecurityObject | undefined,
  adminConfig?: AdminConfig
): Configs {
  if (!adminConfig) {
    return {
      tags: defaultTags,
      security: defaultSecurity,
    };
  }

  return {
    tags: [adminConfig.tagName],
    security: adminConfig.security,
  };
}
