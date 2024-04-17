import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import comments from 'assets/comments.json';
import { CommentComponent } from './comment/comment.component';
import { Comment } from './models/comment';
import { UserService } from 'app/services/user.service';
import { CommentInputComponent } from './comment-input/comment-input.component';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommentComponent, CommonModule, CommentInputComponent],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent {
  comments: Comment[] = comments

  constructor(public userService: UserService) { }

  addComment(content: string) {
    let comment: Comment = {
      id: comments.length,
      time: new Date().toISOString(),
      userName: this.userService.currentUser?.name || 'System',
      content: content
    }
    comments.unshift(comment)
  }

  stopEvent($event: Event) {
    $event.preventDefault()
  }
}
