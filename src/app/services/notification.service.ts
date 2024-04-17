import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  public notifications: {[userId: number]: number} = {}

  constructor() { }
}
