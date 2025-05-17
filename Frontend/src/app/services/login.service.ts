import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { LoginRequest, LoginResponse, TokenPayload } from '../interfaces/login-interface';
import {jwtDecode} from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class LoginService {

  private router = inject(Router);
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

  getDecodedToken(): TokenPayload | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode<TokenPayload>(token);
    } catch (error) {
      console.error('Error al decodificar el token', error);
      return null;
    }
  }

  getUserRole(): string | null {
    return this.getDecodedToken()?.rol ?? null;
  }

  getPrimerInicio(): boolean {
    return this.getDecodedToken()?.primer_inicio_sesion ?? false;
  }
  
  logout(): void {
    this.clearToken();
    this.router.navigate(['/'])
  }
}
