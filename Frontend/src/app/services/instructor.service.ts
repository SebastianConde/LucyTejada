import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Instructor } from '../interfaces/instructor';
import { GetHeaderService } from './get-header.service';

@Injectable({ providedIn: 'root' })
export class InstructorService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/lucyTejada';
  private getHeader = inject(GetHeaderService);

  obtenerInstructores(): Observable<Instructor[]> {
    return this.http.get<Instructor[]>(`${this.baseUrl}/instructores`, {
      headers: this.getHeader.getHeaders()
    });
  }
}