import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompleteRegisterRequest } from '../interfaces/register-interface';


@Injectable({ providedIn: 'root' })
export class CompletarRegisterService {

  private http = inject(HttpClient);
  private baseUrl = 'https://lucytejada.onrender.com/api/lucyTejada/registrar/completar';

  completarRegistro(data: CompleteRegisterRequest): Observable<{mensaje: string}> {
    const url = `${this.baseUrl}?token=${data.token}`;
    return this.http.post<{mensaje: string}>(url, data);
  }
}
