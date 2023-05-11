import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CommentInterface } from '../comment-interface';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  @Input() comment?: CommentInterface;
  @Input() isEdit: boolean = false;
  @Input() isReply: boolean = false;

  @Output() cancel = new EventEmitter();
  @Output() newComment = new EventEmitter();
  @Output() editComment = new EventEmitter();
  @Output() replyComment = new EventEmitter();

  hasFormHead: boolean = true;
  submitLabel: string = 'Post';

  form = this.formBuilder.group({
    authorDetails: this.formBuilder.group({
      author: ['', Validators.required],
      userId: [0, Validators.required],
    }),
    content: ['', Validators.required],
  });

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    if (!this.comment) {
      // New root comment case
      this.form.patchValue({
        authorDetails: {
          userId: null,
        },
      });
    } else if (this.comment && this.isEdit) {
      // Edit case
      this.form.patchValue({
        authorDetails: {
          author: this.comment.author,
          userId: this.comment.userId,
        },
        content: this.comment.content,
      });
      this.submitLabel = 'Edit';
    } else if (this.comment) {
      // Reply case
      this.form.patchValue({
        authorDetails: {
          author: '',
          userId: null,
        },
        content: '',
      });
      this.submitLabel = 'Reply';
    }
  }

  onSubmit(): void {
    if (
      !this.isEdit &&
      !this.comment &&
      this.form.value.authorDetails &&
      this.form.value.authorDetails.author &&
      this.form.value.authorDetails.userId &&
      this.form.value.content
    ) {
      // New root comment case case
      let newComment: CommentInterface = {
        id: 0,
        parentId: null,
        userId: this.form.value.authorDetails.userId,
        author: this.form.value.authorDetails.author,
        content: this.form.value.content.trim(),
        date: new Date(),
        repliesIds: [],
        replies: [],
        avatarUrl: 'assets/img/avatar.png',
      };
      this.newComment.emit(newComment);
    } else if (this.isEdit && this.comment && this.form.value.content) {
      // Edit case
      let newComment: CommentInterface = {
        id: this.comment.id,
        parentId: this.comment.parentId,
        userId: this.comment.userId,
        author: this.comment.author,
        content: this.form.value.content.trim(),
        date: this.comment.date,
        repliesIds: this.comment.repliesIds,
        replies: this.comment.replies,
        avatarUrl: this.comment.avatarUrl,
      };
      this.editComment.emit(newComment);
    } else if (
      this.comment &&
      this.form.value.authorDetails &&
      this.form.value.authorDetails.author &&
      this.form.value.authorDetails.userId &&
      this.form.value.content
    ) {
      // Reply case
      let newComment: CommentInterface = {
        id: 0,
        parentId:
          this.comment.parentId == null
            ? this.comment.id
            : this.comment.parentId,
        userId: this.form.value.authorDetails.userId,
        author: this.form.value.authorDetails.author.trim(),
        content: this.form.value.content.trim(),
        date: new Date(),
        repliesIds: [],
        replies: [],
        avatarUrl: 'assets/img/avatar.png',
      };
      this.replyComment.emit(newComment);
    }
  }
}
