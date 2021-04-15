export interface Post {
  identifier: string;
  title: string;
  slug: string;
  subName: string;
  createdAt: string;
  updatedAt: string;
  body?: string;
  username: string;
  sub: Sub;

  // Virtual fields
  url: string;
  voteScore?: number;
  commentCount?: number;
  userVote?: number;
}

export interface User {
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Sub {
  createdAt: string;
  updatedAt: string;
  name: string;
  title: string;
  description: string;
  imageUrn: string;
  bannerUrn: string;
  username: string;
  posts: Post[];

  // Virtual fields
  imageUrl: string;
  bannerUrl: string;
}

export interface Comment {
  identifier: string;
  createdAt: string;
  updatedAt: string;
  body: string;
  username: string;
  user: User;
  post?: Post;

  // Virtual fields
  voteScore?: number;
  userVote?: number;
}
