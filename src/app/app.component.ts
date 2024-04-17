import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommentsComponent } from './comments/comments.component';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications/notifications.component';
import { User } from './models/user';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, CommentsComponent, NotificationsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  users: User[]

  constructor(public userService: UserService) {
    this.users = userService.users
  }

  onUserChange(user: User) {
    this.userService.currentUser = user
  }
}
