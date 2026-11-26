import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest } from './auth.models';

@Service()
export class AuthApi {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = `${environment.apiUrl}/auth`;

  public register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, payload);
  }

  public login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, payload);
  }

  public me(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.baseUrl}/me`);
  }

  public logout(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/logout`, null);
  }
}
