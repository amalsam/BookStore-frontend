import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../enviornments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
   private baseUrl = environment.apiBaseUrl;
  private apiUrl = this.baseUrl+'/users';
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object // Inject platform info
  ) {
    this.checkLoginStatus();
  }

  private checkLoginStatus() {
    if (isPlatformBrowser(this.platformId)) { // Check if running in browser
      const token = localStorage.getItem('authToken');
      console.log('Stored Token:', token); // Debugging
      this.isLoggedInSubject.next(!!token);
    }
  }

  registerUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  loginUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, user).pipe(
      tap((response: any) => {
        if (response.message === 'Login Successfull' && isPlatformBrowser(this.platformId)) {
          localStorage.setItem('authToken', response.token); // Store token only in browser
          this.isLoggedInSubject.next(true);
        }
      })
    );
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
      this.isLoggedInSubject.next(false);
    }
  }
}
