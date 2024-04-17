import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import comments from 'assets/comments.json';
import { CommentComponent } from './components/comment.component';
import { Comment } from './models/comment';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommentComponent, CommonModule],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent {
  comments: Comment[] = comments
}
