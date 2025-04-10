import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompleteRegisterRequest } from '../interfaces/register-interface';
import { LoginService } from './login.service';


@Injectable({ providedIn: 'root' })
export class CompletarRegisterService {

  private http = inject(HttpClient);
  private loginService = inject(LoginService);
  private baseUrl = 'http://localhost:8080/api/lucyTejada/registrar/completar';

  completarRegistro(data: CompleteRegisterRequest): Observable<string> {
    const token = this.loginService.getToken();
    const url = `${this.baseUrl}?token=${token}`;
    return this.http.post<string>(url, data);
  }
}
