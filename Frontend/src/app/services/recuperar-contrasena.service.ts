import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FinalizarRecuperacionRequest, RecuperarContraRequest } from '../interfaces/recuperar-contra';

@Injectable({
  providedIn: 'root'
})
export class RecuperarContrasenaService {

  private http = inject(HttpClient);
  private url = 'lucytejada.onrender.com/api/lucyTejada/recuperar-contrasena';

  recuperarContra(data: RecuperarContraRequest): Observable<{mensaje: string}> {
    return this.http.post<{mensaje: string}>(this.url,data);
  }

  finalizarRecuperacion(token: string, data: FinalizarRecuperacionRequest): Observable<{mensaje: string}> {
    const url = `${this.url}/terminar?token=${token}`;
    return this.http.put<{mensaje: string}>(url, data);
  }

}
