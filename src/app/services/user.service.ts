import { Injectable } from '@angular/core';
import { User } from 'app/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public currentUser: User | undefined

  constructor() { }
}
