import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

import { LoginRequest, LoginResponse, TokenPayload } from '../interfaces/login-interface';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private router = inject(Router);
  private http = inject(HttpClient);

  private url = 'http://localhost:8080/auth/login';
  private tokenKey = 'auth_token';

  // Método para hacer login: envía credenciales y espera respuesta con token
  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.url, data);
  }

  // Guardar token en localStorage
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Obtener token desde localStorage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Eliminar token de localStorage (logout)
  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // Decodifica el token y devuelve el payload o null si hay error
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

  // Devuelve el rol del usuario extraído del token, o null si no hay token o rol
  getUserRole(): string | null {
    return this.getDecodedToken()?.rol ?? null;
  }

  // Devuelve si es el primer inicio de sesión (campo booleano en token)
  getPrimerInicio(): boolean {
    return this.getDecodedToken()?.primer_inicio_sesion ?? false;
  }

  // Método para cerrar sesión y redirigir a la página raíz
  logout(): void {
    this.clearToken();
    this.router.navigate(['/']);
  }
}
