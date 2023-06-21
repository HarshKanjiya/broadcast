import { Broadcast, Comment, Post, User, Vote } from "@prisma/client";

export type ExtendedPost = Post & {
  broadcast: Broadcast;
  votes: Vote[];
  author: User;
  comments: Comment[];
};
