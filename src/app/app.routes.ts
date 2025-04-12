import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BookListComponent } from './pages/book-list/book-list.component';
import { BookDetailsComponent } from './pages/book-details/book-details.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Default route for the home page
  { path: 'books', component: BookListComponent }, // Route for the book listing page
  { path: 'books/:id', component: BookDetailsComponent }, // Dynamic route for book details
  { path: 'cart', component: CartComponent }, // Route for the shopping cart
  { path: 'checkout', component: CheckoutComponent }, // Route for the checkout page
  { path: 'login', component: LoginComponent }, // Route for the login page
  { path: 'register', component: RegisterComponent },
  { path: 'admin', component: AdminDashboardComponent,canActivate: [AuthGuard]  }, 
  { path: '**', redirectTo: '', pathMatch: 'full' }, // Redirect for undefined routes
 
];


