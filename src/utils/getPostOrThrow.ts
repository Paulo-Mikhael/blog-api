import { ClientError } from "../errors/ClientError";
import { PostModel } from "../models/PostModel";

export async function getPostOrThrow(postId: string, notFindMessage?: string) {
  const postModel = new PostModel();
  const post = await postModel.getById(postId);

  if (!post) {
    const message = notFindMessage ? notFindMessage : "Post não encontrado";
    throw new ClientError(message, 404);
  }

  return post;
}
