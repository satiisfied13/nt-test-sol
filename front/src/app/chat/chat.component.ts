import { Component, effect, inject, OnInit } from '@angular/core';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { UsersBoxComponent } from './users-box/users-box.component';
import { io } from 'socket.io-client';
import { Message, UserService } from './users-box/user.service';

@Component({
  selector: 'app-chat',
  imports: [
    ChatBoxComponent,
    UsersBoxComponent
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
  userService = inject(UserService);
  socket = io('http://localhost:3000', {
    withCredentials: true
  });
  selectedUser = this.userService.selectedUser;
  messages = this.userService.messages;

  constructor() {
    effect(() => {
      const user = this.selectedUser();
      if (user) {
        this.userService.getMessageHistory(user).subscribe(data => {
          this.messages.set(data.reverse());
        });
      }
    });
  }

  ngOnInit() {
    this.socket.on('receiveMessage', (message) => {
      const currentChatId = this.selectedUser()?.id;
      if (message.sender.id === currentChatId || message.receiver.id === currentChatId) {
        this.messages.update(prev => [message, ...prev as Message[]]);
      }
    });
  }

  sendMessage(text: string) {
    const receiver = this.selectedUser();
    if (!receiver) return;

    this.socket.emit('sendDirectMessage', {
      text: text,
      receiverId: receiver.id
    });
  }
}
