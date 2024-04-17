import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommentsComponent } from './comments/comments.component';
import users from 'assets/users.json';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications/notifications.component';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, CommentsComponent, NotificationsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  users: User[] = users
  currentUser: User = users[0]

  constructor() {
  }

  onUserChange(user: User) {
    this.currentUser = user
  }
}
