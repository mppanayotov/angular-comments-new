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
  }

  // Get the name of the option selected by matching its value in the options list
  selectedSortName() {
    return this.sortOptions.find(
      (sortOption) => sortOption.value == this.formSort.value.sortBy
    )?.name;
  }

  // Get comments from database
  getComments(): void {
    this.commentService.getComments().subscribe(
      (comments) => (this.comments = comments),
      () => this.sortComments()
    );
  }

  // Sort comments (thread replies are always ordered by 'most recent')
  sortComments() {
    // Sort by most recent (default)
    this.comments.sort(
      (b, a) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Sort by most recent, then by most comments
    if (this.formSort.value.sortBy == 1) {
      this.comments.sort((a, b) => b.repliesIds.length - a.repliesIds.length);
    }

    return this.comments;
  }

  // Sort replies to a specific comment by date
  sortReplies(commentId: number): CommentInterface[] {
    return this.comments
      .filter((comment) => comment.parentId === commentId)
      .sort((b, a) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  // Handle delete emmiters; Delete reply comments if found
  onDelete(comment: CommentInterface): void {
    const deleteIds: number[] = [comment.id];

    // If comment is root and has replies, enlist their id for removal
    comment.repliesIds.forEach((replyId) => {
      deleteIds.push(replyId);
    });
    deleteIds.forEach((deleteId) => {
      this.commentService
        .deleteComment(deleteId)
        .subscribe(() => this.getComments());
    });

    // If reply has parent, remove the id from its parent's reply list
    if (comment.parentId) {
      const replyParent = this.comments.find(
        (parent) => parent.id === comment.parentId
      );
      const replyIdsArray = replyParent?.repliesIds;

      replyIdsArray?.splice(replyIdsArray.indexOf(comment.id), 1);
      this.commentService
        .updateComment(replyParent as CommentInterface)
        .subscribe(() => this.getComments());
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
    const parentId: number | null = comment.parentId;
    const userId: number = comment.userId;
    const author: string = comment.author;
    const content: string = comment.content;
    const date: Date = comment.date;
    const repliesIds: number[] = comment.repliesIds;
    const replies: CommentInterface[] = comment.replies;
    const avatarUrl: null | string = comment.avatarUrl;

    if (comment.parentId) {
      const replyParent = this.comments.find(
        (parent) => parent.id === comment.parentId
      );
      const replyIdsArray = replyParent?.repliesIds;

      replyIdsArray?.push(comment.id);
      this.commentService
        .updateComment(replyParent as CommentInterface)
        .subscribe(() => this.getComments());
    }

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
