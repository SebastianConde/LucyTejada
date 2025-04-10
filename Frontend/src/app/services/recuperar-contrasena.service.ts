import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RecuperarContraRequest } from '../interfaces/recuperar-contra';

@Injectable({
  providedIn: 'root'
})
export class RecuperarContrasenaService {

  private http = inject(HttpClient);
  private url = 'http://localhost:8080/api/lucyTejada/recuperar-contrasena';


  constructor() {}

  recuperarContra(data: RecuperarContraRequest): Observable<{mensaje: string}> {
    return this.http.post<{mensaje: string}>(this.url,data);
  }

}
