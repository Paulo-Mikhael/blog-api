interface CreatePostProps {
  title: string;
  content: string;
  category: string;
  authorId: string;
}

export class PostService {
  async create(post: CreatePostProps) {
    return post;
  }
}
