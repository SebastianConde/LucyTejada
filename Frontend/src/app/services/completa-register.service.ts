import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompleteRegisterRequest } from '../interfaces/register-interface';

@Injectable({
  providedIn: 'root'
})
export class CompletarRegisterService {
  
  private http = inject(HttpClient);
  private url = 'http://localhost:8080/api/lucyTejada/registrar/completar?'

  constructor() {}

  completarRegistro(data: CompleteRegisterRequest ): Observable<String>{
    return this.http.post<String>(this.url, data)
  }
  
}
