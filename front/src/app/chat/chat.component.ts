import { Component } from '@angular/core';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { UsersBoxComponent } from './users-box/users-box.component';

@Component({
  selector: 'app-chat',
  imports: [
    ChatBoxComponent,
    UsersBoxComponent
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {

}
