import { Injectable, inject } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterRequest } from '../interfaces/registrar-usuario';
import { GetHeaderService } from './get-header.service';

@Injectable({ providedIn: 'root' })
export class RegistroService {
  private getHeader = inject(GetHeaderService)
  private http = inject(HttpClient);
  private baseUrl = 'lucytejada.onrender.com/api/lucyTejada/registrar';

  registrarUsuario(data: RegisterRequest): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(this.baseUrl, data, {
      headers: this.getHeader.getHeaders(),
    });
  }
}
