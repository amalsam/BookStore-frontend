// home.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
// Adjust path
 // Assume this exists
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.services';
import { BookService } from '../../services/book.services';

interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  description: string;
  imageUrl: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  books: Book[] = [];
  private authSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private bookService: BookService,
    private router: Router
  ) {}

  ngOnInit() {
    // Subscribe to auth state
    this.authSubscription = this.authService.authState$.subscribe(state => {
      this.isLoggedIn = state.isLoggedIn;
    });

    // Fetch all books
    this.loadBooks();
  }

  loadBooks() {
    this.bookService.getBooks().subscribe({
      next: (books: Book[]) => {
        this.books = books;
      },
      error: (err) => {
        console.error('Error fetching books:', err);
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  addToCart(bookId: number) {
    if (this.isLoggedIn) {
      this.bookService.addToCart(bookId).subscribe({
        next: () => {
          console.log(`Book ${bookId} added to cart`);
          // Optionally show a success message or update UI
        },
        error: (err: any) => {
          console.error('Error adding to cart:', err);
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  buyNow(bookId: number) {
    if (this.isLoggedIn) {
      this.router.navigate(['/checkout'], { queryParams: { bookId } });
    } else {
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}