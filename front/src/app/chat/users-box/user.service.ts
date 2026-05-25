import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface UserData {
  id: number;
  email: string;
  name: string;
}

export interface Message {
  id: number;
  text: string;
  createdAt: string;
  sender: UserData;
  receiver: UserData;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  http = inject(HttpClient);
  apiUrl = 'http://localhost:3000';
  user = signal<UserData | null>(null);
  selectedUser = signal<UserData | null>(null);
  messages = signal<Message[] | null>(null);

  changeUserName(name: string) {
    return this.http.put(`${this.apiUrl}/user/name/`, { name: name });
  }

  getAllUsers() {
    return this.http.get<UserData[]>(`${this.apiUrl}/user/all`);
  }

  getMessageHistory(user: UserData) {
    return this.http.get<Message[]>(`${this.apiUrl}/chat/history/${user.id}`);
  }
}
