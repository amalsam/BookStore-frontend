import { Component } from '@angular/core';
import { UserService } from '../../services/user.services';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports : [FormsModule,
    CommonModule
  ]
})
export class RegisterComponent {
  user = {
    name: '',
    email: '',
    password: '',
  };

  confirmPassword = ''

  constructor(private userService: UserService) {}

  onSubmit(){
    console.log(this.user)
  }

  register() {
    console.log(this.user + this.confirmPassword)
    
    if (this.user.password !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    this.userService.registerUser(this.user).subscribe(
      (response) => {
        alert(response); // Show success message
      },
      (error) => {
        console.error(error);
        alert('Registration failed. Please try again.');
      }
    );
  }
}
