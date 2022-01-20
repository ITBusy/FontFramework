import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AccountInterface } from 'src/app/interface/account.interface';
import baseUrl from '../commom';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http : HttpClient, private router: Router) { }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn() {
    return this.getToken() !== null;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['account']);
  }

  getAccountJson(username: string) {
    return this.http.get<AccountInterface[]>(`${baseUrl}/Students?username=${username}`);
  }

  AddAccount(Students: any) {
    return this.http.post<AccountInterface[]>(`${baseUrl}/Students`, Students);
  }
}
