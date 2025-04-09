import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { LoginRequest, LoginResponse } from '../interfaces/login-interface';

@Injectable({ providedIn: 'root' })
export class LoginService {

  private http = inject(HttpClient);
  private url = 'http://localhost:8080/auth/login';
  private tokenKey = 'auth_token';

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.url, data);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

}
