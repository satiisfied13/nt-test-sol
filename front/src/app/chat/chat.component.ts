import { Component, inject } from '@angular/core';
import { AuthService } from '../login/auth.service';
import { MatCard } from '@angular/material/card';
import { MatFormField, MatInput } from '@angular/material/input';
import { MatLabel } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { FormControl } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-chat',
  imports: [
    MatCard,
    MatFormField,
    MatInput,
    MatLabel,
    MatButton
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  userService = inject(UserService);
  authService = inject(AuthService);
  user = this.userService.user;
  name = new FormControl('');
  isNameChange = false;

  onLogout() {
    this.authService.logout();
  }

  onNameChange() {
    this.isNameChange = true;
  }

  onNameChangeSubmit() {
    this.isNameChange = false;
  }
}
