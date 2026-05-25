import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { UserData, UserService } from '../user.service';

export interface UserInput {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient);
  router = inject(Router);
  apiUrl = 'http://localhost:3000/user';
  user = inject(UserService).user;

  constructor() {
    this.checkSession();
  }

  login(credentials: UserInput) {
    return this.http.post<UserData>(`${this.apiUrl}/login/`, credentials).pipe(
      tap(response => {
        this.user.set({
          email: response.email,
          name: response.name,
          id: response.id
        });
      })
    );
  }

  checkSession() {
    this.http.get<UserData>(`${this.apiUrl}/me`).subscribe({
      next: (userData) => {
        this.user.set(userData);
        this.router.navigate(['chat']);
      },
      error: () => {
        this.user.set(null);
      }
    });
  }

  logout() {
    this.http.post(`${this.apiUrl}/logout/`, {}).subscribe({
      next: () => {
        this.user.set(null);
        this.router.navigate(['/login']);
      },
      error: (err) => console.error('Logout failed', err)
    });
  }
}
