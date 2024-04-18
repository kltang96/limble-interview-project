import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import comments from 'assets/comments.json';
import { CommentComponent } from './comment/comment.component';
import { Comment } from './models/comment';
import { UserService } from 'app/services/user.service';
import { CommentInputComponent } from './comment-input/comment-input.component';
import { NotificationService } from 'app/services/notification.service';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommentComponent, CommonModule, CommentInputComponent],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent {
  comments: Comment[] = comments

  constructor(public userService: UserService, public notificationService: NotificationService) { }

  addComment(content: string) {
    let comment: Comment = {
      id: comments.length,
      time: new Date().toISOString(),
      userName: this.userService.currentUser?.name || 'System',
      content: content
    }

    // this would be done on the backend
    this.notificationService.updateNotificationBasedOnComment(comment)

    comments.unshift(comment)
  }

}
