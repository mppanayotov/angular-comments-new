import { Component, Output, OnInit } from '@angular/core';

import { CommentInterface } from '../comment-interface';
import { CommentService } from '../comment.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  @Output() comment?: CommentInterface;

  hasOpenNew: boolean = false;
  comments: CommentInterface[] = [];

  constructor(private commentService: CommentService) {}

  ngOnInit(): void {
    this.getComments();
  }

  // Get comments from database
  getComments(): void {
    this.commentService
      .getComments()
      .subscribe((comments) => (this.comments = comments));
  }

  // Update when comments are changed
  updateComments() {
    return this.comments.sort(
      (b, a) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  // Get replies to a specific comment and sort by date
  getrepliesIds(commentId: number): CommentInterface[] {
    return this.comments
      .filter((comment) => comment.parentId === commentId)
      .sort((b, a) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  // Handle delete emmiters
  onDelete(comment: CommentInterface): void {
    this.commentService
      .deleteComment(comment.id)
      .subscribe(() => this.getComments());
  }

  // Handle new comment emmiters
  onNew(comment: CommentInterface): void {
    let parentId: number | null = comment.parentId;
    let userId: number = comment.userId;
    let author: string = comment.author;
    let content: string = comment.content;
    let date: Date = comment.date;
    let repliesIds: Array<[]> = comment.repliesIds;
    let replies: CommentInterface[] = comment.replies;
    let avatarUrl: null | string = comment.avatarUrl;

    this.commentService
      .addComment({
        parentId,
        userId,
        author,
        content,
        date,
        repliesIds,
        replies,
        avatarUrl,
      } as CommentInterface)
      .subscribe(() => this.getComments());
  }

  // Handle edit comment emmiters
  onEdit(comment: CommentInterface): void {
    this.commentService
      .updateComment(comment as CommentInterface)
      .subscribe(() => this.getComments());
  }

  // Handle reply comment emmiters
  onReply(comment: CommentInterface): void {
    let parentId: number | null = comment.parentId;
    let userId: number = comment.userId;
    let author: string = comment.author;
    let content: string = comment.content;
    let date: Date = comment.date;
    let repliesIds: Array<[]> = comment.repliesIds;
    let replies: CommentInterface[] = comment.replies;
    let avatarUrl: null | string = comment.avatarUrl;

    this.commentService
      .addComment({
        parentId,
        userId,
        author,
        content,
        date,
        repliesIds,
        replies,
        avatarUrl,
      } as CommentInterface)
      .subscribe(() => this.getComments());
  }
}
