// src/app/services/auth.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState = new BehaviorSubject<{
    isLoggedIn: boolean;
    isAdmin: boolean;
    userName: string | null;
  }>({
    isLoggedIn: false,
    isAdmin: false,
    userName: null
  });

  authState$ = this.authState.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.updateAuthState(); // Initialize state on app load
  }

  updateAuthState() {
    if (isPlatformBrowser(this.platformId)) {
      // Only access localStorage in the browser
      const isLoggedIn = !!localStorage.getItem('token');
      const isAdmin = localStorage.getItem('userRole') === 'ADMIN';
      const userName = localStorage.getItem('userName');
      this.authState.next({ isLoggedIn, isAdmin, userName });
    } else {
      // Default state for non-browser environments (e.g., server)
      this.authState.next({
        isLoggedIn: false,
        isAdmin: false,
        userName: null
      });
    }
  }

  login(token: string, userRole: string, userName: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', userRole);
      localStorage.setItem('userName', userName);
    }
    this.updateAuthState();
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
    }
    this.updateAuthState();
  }
}