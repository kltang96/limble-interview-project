import { Injectable } from '@angular/core';
import { User } from 'app/models/user';
import users from 'assets/users.json';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public users: User[] = users
  public currentUser: User | undefined

  constructor() { }
}
