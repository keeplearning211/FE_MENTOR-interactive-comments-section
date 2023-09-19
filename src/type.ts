export type Ref = HTMLDivElement | null;

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  score: number;
  user: User;
  replies?: Comment[];
  replyingTo?: string;
}

export interface User {
  image?: {
    png: string;
    webp: string;
  };
  username: string;
}

export interface CommentSection {
  currentUser: User;
  comments: Comment[];
}

export enum CommentActionType {
  SET_COMMENT_SECTION = 'SET_COMMENT_SECTION',
  COMMENT = 'COMMENT',
  REPLY = 'REPLY',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  VOTE = 'VOTE'
}