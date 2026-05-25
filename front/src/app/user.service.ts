import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserData } from './login/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  http = inject(HttpClient);
  apiUrl = 'http://localhost:3000/user';
  user = signal<UserData | null>(null);
}
