import type { SchemaObject } from "../types/SchemaObject.js";

export const schemas: SchemaObject = {
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
        description: "Senha criptografada do usuário",
        minLength: 8,
      },
      profile: {
        $ref: "#/components/schemas/UserProfile",
      },
    },
  },
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
  Post: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "Identificador único do post.",
      },
      title: {
        type: "string",
        description: "O título do post.",
      },
      content: {
        type: "string",
        description: "Conteúdo principal do post no formato markdown.",
      },
      slug: {
        type: "string",
        description: "Identificador 'SEO-friendly' para o post.",
      },
      cover: {
        type: "string",
        description: "Url da capa do post.",
      },
      category: {
        type: "string",
        description: "Categoria do post.",
      },
      createdAt: {
        type: "string",
        format: "date-time",
        description: "Data e hora de criação do post, no formato ISO 8601.",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
        description:
          "Data e hora da última atualização do post, no formato ISO 8601.",
      },
      authorId: {
        type: "string",
        description: "Identificador único do perfil de usuário autor do post.",
      },
    },
    required: [
      "content",
      "title",
      "id",
      "slug",
      "category",
      "createdAt",
      "updatedAt",
      "authorId",
    ],
  },
};
