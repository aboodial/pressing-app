import { Service, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'client' | 'gestionnaire';
}

export interface AuthResponse {
  user: User;
  token: string;
}

const API_URL = 'http://localhost:8000/api';

@Service()
export class Auth {
  private http = inject(HttpClient);

  currentUser = signal<User | null>(null);

  constructor() {
    // Au démarrage de l'app, on vérifie si un utilisateur était déjà connecté (token sauvegardé)
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
    }
  }

  register(
    name: string,
    email: string,
    password: string,
    password_confirmation: string,
  ): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${API_URL}/register`, {
        name,
        email,
        password,
        password_confirmation,
      })
      .pipe(tap((response) => this.saveSession(response)));
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${API_URL}/login`, {
        email,
        password,
      })
      .pipe(tap((response) => this.saveSession(response)));
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.currentUser.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  private saveSession(response: AuthResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    this.currentUser.set(response.user);
  }
}
