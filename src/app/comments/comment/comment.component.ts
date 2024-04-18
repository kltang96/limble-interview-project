import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Comment } from '../models/comment';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css',
  encapsulation: ViewEncapsulation.None
})
export class CommentComponent {
  @Input({ required: true })
  comment!: Comment;

  alterCommentHtml() {
    return this.comment.content.replace('<ping ', '<a href=\"#\"').replace('ping>', 'a>')
  }
}
