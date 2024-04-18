import { Component } from '@angular/core';
import { NotificationService } from 'app/services/notification.service';
import { UserService } from 'app/services/user.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent {

  constructor(public userService: UserService, public notificationService: NotificationService) { }

  getNotificationCount() {
    if(this.userService.currentUser?.userID.toString() == null) {
      return null
    }
    return this.notificationService.notifications[this.userService.currentUser?.userID.toString()] || 0
  }
}
