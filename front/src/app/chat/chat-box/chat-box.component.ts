import { Component, effect, EventEmitter, inject, Output } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatFormField, MatInput, MatSuffix } from '@angular/material/input';
import { MatLabel } from '@angular/material/form-field';
import { MatButton, MatIconButton } from '@angular/material/button';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { UserService } from '../users-box/user.service';
import { AuthService } from '../../login/auth.service';
import moment from 'moment';

@Component({
  selector: 'app-chat-box',
  imports: [
    MatCard,
    MatFormField,
    MatInput,
    MatLabel,
    MatButton,
    ReactiveFormsModule,
    MatIcon,
    MatSuffix,
    MatIconButton
  ],
  templateUrl: './chat-box.component.html',
  styleUrl: './chat-box.component.scss'
})
export class ChatBoxComponent {
  userService = inject(UserService);
  authService = inject(AuthService);
  user = this.userService.user;
  selectedUser = this.userService.selectedUser;
  messages = this.userService.messages;
  name = new FormControl('', { nonNullable: true });
  message = new FormControl('', { nonNullable: true });
  isNameChange = false;

  @Output() sendMessage = new EventEmitter();

  constructor() {
    effect(() => {
      this.selectedUser();
      this.focusInput('msgInp');
    });
  }

  onLogout() {
    this.authService.logout();
  }

  onNameChange() {
    this.isNameChange = true;
    if (this.user()) {
      this.name.setValue(this.user()!.name);
    }
    this.focusInput('nameInp');
  }

  onNameChangeSubmit() {
    if (this.name.value) {
      this.userService.changeUserName(this.name.value).subscribe(v => {
        if (this.user()) {
          this.user.set({
            id: this.user()!.id,
            email: this.user()!.email,
            name: this.name.value
          })
        }
        this.name.setValue('');
        this.isNameChange = false;
      }, e => this.isNameChange = false);
    } else {
      this.isNameChange = false;
      return;
    }
  }

  send(text: string) {
    this.sendMessage.emit(text);
    this.message.setValue('');
    this.focusInput('msgInp');
  }

  focusInput(id: string) {
    setTimeout(() => {
      const target = document.getElementById(id);
      if (target) {
        target.focus();
      }
    }, 10)
  }

  readonly moment = moment;
}
