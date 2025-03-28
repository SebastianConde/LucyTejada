import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LlamarBackendService {

  private baseUrl = 'http://localhost:8080'; // URL del backend

  constructor(private http: HttpClient) { }

  // Método para obtener datos desde el backend
  getDatos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/tu-endpoint`);
  }
}
