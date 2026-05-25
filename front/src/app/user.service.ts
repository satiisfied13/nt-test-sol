import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface UserData {
  id: number;
  email: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  http = inject(HttpClient);
  apiUrl = 'http://localhost:3000/user';
  user = signal<UserData | null>(null);
  selectedUser = signal<UserData | null>(null);

  changeUserName(name: string) {
    return this.http.put(`${this.apiUrl}/name/`, { name: name });
  }

  getAllUsers() {
    return this.http.get<UserData[]>(`${this.apiUrl}/all`);
  }
}
