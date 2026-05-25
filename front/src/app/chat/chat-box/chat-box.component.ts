import { Component, inject } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatFormField, MatInput, MatSuffix } from '@angular/material/input';
import { MatLabel } from '@angular/material/form-field';
import { MatButton, MatIconButton } from '@angular/material/button';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { UserService } from '../../user.service';
import { AuthService } from '../../login/auth.service';

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
  name = new FormControl('', { nonNullable: true });
  isNameChange = false;

  onLogout() {
    this.authService.logout();
  }

  onNameChange() {
    this.isNameChange = true;
    if (this.user()) {
      this.name.setValue(this.user()!.name);
    }
    setTimeout(() => {
      const target = document.getElementById('nameInp');
      if (target) {
        target.focus();
      }
    }, 100);
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
}
