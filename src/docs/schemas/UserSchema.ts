import type { SchemaObject } from "../../types/SchemaObject";

export const UserSchema: SchemaObject = {
  User: {
    type: "object",
    required: ["id", "email", "password"],
    properties: {
      id: {
        type: "string",
        format: "uuid",
        description: "Identificador único do usuário",
      },
      email: {
        type: "string",
        format: "email",
        description: "Endereço de e-mail do usuário",
      },
      password: {
        type: "string",
        description:
          "Senha criptografada do usuário, a senha deve conter pelo menos 8 caracteres, um número, uma letra maiúscula e um caractere especial.",
        minLength: 8,
        example: "Ex@mple123",
      },
      profile: {
        $ref: "#/components/schemas/UserProfile",
      },
    },
  },
};
