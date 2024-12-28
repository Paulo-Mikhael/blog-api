type SchemaTypes = "object" | "string";
type SchemaFormats = "date-time";
type Schema = {
  type: SchemaTypes;
  description: string;
  properties: {
    [fieldName: string]: {
      type: SchemaTypes;
      description: string;
      nullable?: boolean;
      format?: SchemaFormats;
    };
  };
  required?: string[];
};

export const postReturnSchema: Schema = {
  type: "object",
  description: "Informações do post disponíveis à todos os usuários.",
  properties: {
    id: {
      type: "string",
      description: "Identificador único para o post.",
    },
    title: {
      type: "string",
      description: "O título do post.",
    },
    slug: {
      type: "string",
      description: "Um identificador amigável para URL do post.",
    },
    cover: {
      type: "string",
      nullable: true,
      description: "A URL da imagem de capa do post.",
    },
    content: {
      type: "string",
      description: "O conteúdo principal do post, em formato markdown.",
    },
    category: {
      type: "string",
      description: "A categoria à qual o post pertence.",
    },
    createdAt: {
      type: "string",
      format: "date-time",
      description: "A data e hora de criação do post.",
    },
    updatedAt: {
      type: "string",
      format: "date-time",
      description: "A data e hora da última atualização do post.",
    },
    authorId: {
      type: "string",
      description: "O identificador único do perfil de usuário autor do post.",
    },
  },
  required: [
    "id",
    "title",
    "slug",
    "content",
    "category",
    "createdAt",
    "updatedAt",
    "authorId",
  ],
};
