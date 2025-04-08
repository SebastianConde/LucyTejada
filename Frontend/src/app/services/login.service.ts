import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private http = inject(HttpClient);

  login(data: { username: string; password: string }): Observable<any> {
    return this.http.post('http://localhost:8080/auth/login', data);
  }
}
