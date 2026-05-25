import { Component, inject, OnInit } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { UserData, UserService } from './user.service';

@Component({
  selector: 'app-users-box',
  imports: [
    MatCard
  ],
  templateUrl: './users-box.component.html',
  styleUrl: './users-box.component.scss'
})
export class UsersBoxComponent implements OnInit {
  userService = inject(UserService)
  user = this.userService.user;
  selectedUser = this.userService.selectedUser;
  users: UserData[] = [];

  ngOnInit() {
    this.userService.getAllUsers().subscribe(v => {
      this.users = v.filter(user => user.id !== this.user()!.id);
    });
  }

  selectUser(user: UserData) {
    if (user.id === this.selectedUser()?.id) {
      this.selectedUser.set(null);
    } else {
      this.selectedUser.set(user);
    }
  }
}
