// login.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.services'; // Check path correctness
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.services';
import { environment } from '../../../enviornments/environment';
 // Adjust path as needed

@Component({
  selector: 'app-login',
  standalone: true, // Added since you're using standalone components
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Fixed styleUrl typo
})
export class LoginComponent {
  private baseUrl = environment.apiBaseUrl;
  user = {
    email: '',
    password: ''
  };
  errorMessage: string = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService // Inject AuthService
  ) {}

  login() {
    this.errorMessage = ''; // Reset error message
    this.userService.loginUser(this.user).subscribe({
      next: (response: any) => {
        console.log('Login successful:', response);
        console.log('User Role:', response.role);

        // Use AuthService to handle login and update state
        this.authService.login(response.token, response.role, response.name);

        // Navigate based on user role
        if (response.role === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        this.errorMessage = err.error?.message || 'Invalid email or password'; // Improved error handling
      }
    });
  }
}