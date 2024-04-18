import { Injectable } from '@angular/core';
import { Comment } from 'app/comments/models/comment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  public notifications: {[userId: string]: number} = {}

  constructor() { }

  updateNotificationBasedOnComment(comment: Comment) {
    let commentHtml = document.createElement('html');
    commentHtml.innerHTML = comment.content
    let pings = commentHtml.getElementsByTagName('ping')

    for(let i = 0; i < pings.length; i++) {
      let userId: string | null = pings[i].getAttribute('userid')

      if(userId != null && userId != '') {
        if(this.notifications[userId] == null) {
          this.notifications[userId] = 0
        }
        this.notifications[userId]++
      }
    }
  }
}
