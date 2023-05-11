import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommentInterface } from '../comment-interface';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit, CommentInterface {
  @Input() comment!: CommentInterface;
  @Input() repliesInput: CommentInterface[] = [];

  @Output() deleteComment = new EventEmitter();
  @Output() replyComment = new EventEmitter();
  @Output() editComment = new EventEmitter();

  hasOpenEdit: boolean = false;
  hasOpenReply: boolean = false;

  id: number = 0;
  parentId: number | null = null;
  userId: number = 0;
  author: string = '';
  content: string = '';
  date: Date = new Date();
  repliesIds: Array<[]> = [];
  replies: CommentInterface[] = [];
  avatarUrl: null | string = null;

  constructor() {}

  ngOnInit(): void {
    this.id = this.comment.id;
    this.parentId = this.comment.parentId;
    this.userId = this.comment.userId;
    this.author = this.comment.author;
    this.content = this.comment.content;
    this.date = this.comment.date;
    this.repliesIds = this.comment.repliesIds;
    this.replies = this.repliesInput;
    this.avatarUrl = this.comment.avatarUrl;
  }

  updateReplies() {
    return this.replies;
  }
}
