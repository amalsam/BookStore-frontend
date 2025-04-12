// navbar.component.ts
import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
// Adjust path as needed
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.services';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  isLoggedIn = false;
  isAdmin = false;
  userName: string | null = null;
  private authSubscription!: Subscription;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.authSubscription = this.authService.authState$.subscribe(state => {
      this.isLoggedIn = state.isLoggedIn;
      this.isAdmin = state.isAdmin;
      this.userName = state.userName;
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.isMenuOpen = false;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (window.innerWidth > 768) {
      this.isMenuOpen = false;
    }
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}