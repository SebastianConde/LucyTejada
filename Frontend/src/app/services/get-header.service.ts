import { HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginService } from './login.service';

@Injectable({ providedIn: 'root' })
export class GetHeaderService {
  private readonly loginService = inject(LoginService);

  getHeaders(): HttpHeaders {
    const token = this.loginService.getToken();

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }
}
