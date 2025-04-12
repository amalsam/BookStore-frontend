import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    let userRole;
    if (typeof window !== 'undefined') {
       userRole = localStorage.getItem('userRole');
    }
    
    //const userRole = localStorage.getItem('userRole');
    if (userRole === 'ADMIN') {
      return true;
    } else {
      this.router.navigate(['/login']); // Redirect to login if not Admin
      return false;
    }
  }
}
