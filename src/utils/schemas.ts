import type { SchemaObject } from "../types/SchemaObject.js";

export const schemas: SchemaObject = {
  User: {
    type: "object",
    properties: {
      id: { type: "number" },
      name: { type: "string" },
      email: { type: "string" },
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
