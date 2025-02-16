import type { SchemaObject } from "../../types/SchemaObject";

export const UserProfileSchema: SchemaObject = {
  UserProfile: {
    type: "object",
    required: ["id", "name", "biography", "email"],
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
      email: {
        type: "string",
        format: "email",
        description: "Email do usuário",
      },
    },
  },
};
