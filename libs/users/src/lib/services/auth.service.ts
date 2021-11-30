import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './../models/user';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiURLUsers = environment.apiUrl + 'users';

  constructor(private http: HttpClient, private tokenService: LocalstorageService, private router: Router) { }

  login(email: string, password: string): Observable<User> {
      return this.http.post<User>(`${this.apiURLUsers}/login`, { email: email, password: password });
  }


  logout() {
      this.tokenService.removeToken();
      this.router.navigate(['/login']);
  }
}
