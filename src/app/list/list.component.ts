import { Component, Output, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

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

  sortOptions = [
    { value: 0, name: 'Most recent' },
    { value: 1, name: 'Most comments' },
  ];

  formSort = this.formBuilder.group({
    sortBy: [this.sortOptions[0].value],
  });

  constructor(
    private commentService: CommentService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getComments();
  }

  // Increment selected sort option. Reset to start if max length reached.
  changeSelect() {
    this.formSort.patchValue({
      sortBy:
        this.formSort.value.sortBy! == this.sortOptions.length - 1
          ? 0
          : this.formSort.value.sortBy! + 1,
    });

    this.sortComments();
  }

  // Get the name of the option selected by matching its value in the options list
  selectedSortName() {
    return this.sortOptions.find(
      (sortOption) => sortOption.value == this.formSort.value.sortBy
    )?.name;
  }

  // Get comments from database
  getComments(): void {
    this.commentService
      .getComments()
      .subscribe((comments) => (this.comments = this.sortComments(comments)));
  }

  // Sort comments (thread replies are always ordered by 'most recent')
  sortComments(comments?: CommentInterface[]) {
    if (!comments) {
      comments = this.comments;
    }

    // Sort by most recent (default). If comment has replies, sort it by most recent reply date.
    comments.sort(
      (b, a) =>
        new Date(
          a.repliesIds.length > 0
            ? Math.max(
                ...comments!
                  .filter((comment) => comment.parentId === a.id)
                  .map((reply) => new Date(reply.date).getTime())
              )
            : a.date
        ).getTime() -
        new Date(
          b.repliesIds.length > 0
            ? Math.max(
                ...comments!
                  .filter((comment) => comment.parentId === b.id)
                  .map((reply) => new Date(reply.date).getTime())
              )
            : b.date
        ).getTime()
    );

    // Sort by most recent, then by most comments
    if (this.formSort.value.sortBy == 1) {
      comments.sort((a, b) => b.repliesIds.length - a.repliesIds.length);
    }

    return comments;
  }

  // Filter replies to a specific comment
  filterReplies(commentId: number): CommentInterface[] {
    return this.comments.filter((comment) => comment.parentId === commentId);
  }

  // Handle delete emmiters; Delete reply comments if found
  onDelete(comment: CommentInterface): void {
    // If reply has parent, remove the id from its parent's reply list
    if (comment.parentId) {
      const replyParent = this.comments.find(
        (parent) => parent.id === comment.parentId
      );
      const replyIdsArray = replyParent?.repliesIds;

      replyIdsArray?.splice(replyIdsArray.indexOf(comment.id), 1);
      this.commentService
        .updateComment(replyParent as CommentInterface)
        .subscribe(() =>
          this.commentService
            .deleteComment(comment.id)
            .subscribe(() => this.getComments())
        );
    } else {
      // If comment is root and has replies, enlist their id for removal
      if (comment.repliesIds.length > 0) {
        comment.repliesIds.forEach((replyId) => {
          if (
            comment.repliesIds.indexOf(replyId) <
            comment.repliesIds.length - 1
          ) {
            this.commentService
              .deleteComment(replyId)
              .subscribe(() => this.commentService.deleteComment(replyId + 1));
          } else {
            this.commentService
              .deleteComment(replyId)
              .subscribe(() =>
                this.commentService
                  .deleteComment(comment.id)
                  .subscribe(() => this.getComments())
              );
          }
        });
      } else {
        // If comment is root and has no replies, delete it
        this.commentService
          .deleteComment(comment.id)
          .subscribe(() => this.getComments());
      }
    }
  }

  // Handle new comment emmiters
  onNew(comment: CommentInterface): void {
    const parentId: number | null = comment.parentId;
    const userId: number = comment.userId;
    const author: string = comment.author;
    const content: string = comment.content;
    const date: Date = comment.date;
    const repliesIds: number[] = [];
    const replies: CommentInterface[] = comment.replies;
    const avatarUrl: null | string = comment.avatarUrl;

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
    const parentId: number = comment.parentId!;
    const userId: number = comment.userId;
    const author: string = comment.author;
    const content: string = comment.content;
    const date: Date = comment.date;
    const repliesIds: number[] = comment.repliesIds;
    const replies: CommentInterface[] = comment.replies;
    const avatarUrl: null | string = comment.avatarUrl;

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
      .subscribe((newComment) =>
        // Wait to recieve new comment ID from server, push it to parent's reply list, update parent reply list
        this.commentService
          .updateComment(
            this.pushIdtoParent(parentId, newComment.id) as CommentInterface
          )
          .subscribe(() => this.getComments())
      );
  }

  // Push new reply ID to parent's reply list
  pushIdtoParent(parentId: number, id: number): CommentInterface {
    const parent = this.comments.find((comment) => comment.id === parentId);
    parent!.repliesIds.push(id);

    return parent!;
  }
}
