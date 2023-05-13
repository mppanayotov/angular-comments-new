export interface CommentInterface {
  // ID of the comment
  id: number;
  // ID of the comment's parent / Null if comment is root comment
  parentId: number | null;
  // UserID used for evaluation
  userId: number;
  // Author used for display name
  author: string;
  // Text content of the comment
  content: string;
  // Date should be generated server-side
  date: Date;
  // Replies
  replies: CommentInterface[];
  // Replies IDs
  repliesIds: number[];
  // Avatar should be generated server-side / Optional upload for guests
  avatarUrl: null | string;
}
