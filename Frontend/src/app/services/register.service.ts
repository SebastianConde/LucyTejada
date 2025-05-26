import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterRequest } from '../interfaces/registrar-usuario';
import { LoginService } from './login.service';

@Injectable({ providedIn: 'root' })
export class RegistroService {
  private http = inject(HttpClient);
  private loginService = inject(LoginService);
  private baseUrl = 'http://localhost:8080/api/lucyTejada/registrar';

  private getHeaders(): HttpHeaders {
    const token = this.loginService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  registrarUsuario(data: RegisterRequest): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(this.baseUrl, data, {
      headers: this.getHeaders()
    });
  }
}
