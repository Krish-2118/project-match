export type ProjectFeedItem = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  videoUrl?: string;
  category?: string;
  year?: string;
  tags: string;
  createdAt: string;
  commentsCount: number;
  owner: {
    name: string | null;
  };
};

export type ProjectCommentPayload = {
  id: string;
  body: string;
  createdAt: string;
  author: {
    id: string;
    name: string | null;
    image: string | null;
    major: string | null;
    university: string | null;
  };
};
