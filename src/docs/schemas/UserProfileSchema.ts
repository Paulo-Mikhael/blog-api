import type { SchemaObject } from "../types/SchemaObject";

export const UserProfileSchema: SchemaObject = {
  UserProfile: {
    type: "object",
    required: ["id", "name", "biography", "userId"],
    properties: {
      id: {
        type: "string",
        format: "uuid",
        description: "Identificador único do perfil do usuário",
      },
      name: {
        type: "string",
        description: "Nome do usuário no perfil",
        minLength: 1,
        maxLength: 30,
      },
      biography: {
        type: "string",
        description: "Biografia do usuário",
        minLength: 1,
      },
      avatar: {
        type: "string",
        format: "url",
        description: "URL do avatar do usuário (pode estar vazio)",
      },
      userId: {
        type: "string",
        format: "uuid",
        description: "ID do usuário associado ao perfil",
      },
    },
  },
};
