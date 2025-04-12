// admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../enviornments/environment';
import { AuthService } from '../../services/auth.services';
 // Fixed typo in environment path

// Type for existing books (with id)
interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  isRequired: boolean;
}

// Type for new book payload (without id)
interface NewBook {
  title: string;
  author: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  isRequired: boolean;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  private baseUrl = environment.apiBaseUrl;
  books: Book[] = [];
  newBook: NewBook = { 
    title: '', 
    author: '', 
    description: '', 
    price: 0, 
    imageUrl: '', 
    stock: 0, 
    isRequired: true // Default to true for visibility
  };
  selectedFile: File | null = null;
  errorMessage: string = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.getBooks();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadImage(): Promise<boolean> {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select an image to upload.';
      return Promise.resolve(false);
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<{ imageUrl: string }>(`${this.baseUrl}/admin/upload`, formData, { headers })
      .toPromise()
      .then(response => {
        this.newBook.imageUrl = response!.imageUrl;
        this.errorMessage = '';
        return true;
      })
      .catch(error => {
        console.error('Upload failed', error);
        this.errorMessage = 'Image upload failed. Please try again.';
        return false;
      });
  }

  getBooks() {
    this.http.get<Book[]>(`${this.baseUrl}/books`)
      .subscribe({
        next: (data) => {
          this.books = data;
          console.log('Fetched books:', data); // Debug log
        },
        error: (err) => {
          console.error('Error fetching books', err);
          this.errorMessage = 'Failed to load books.';
        }
      });
  }

  async addBook() {
    this.errorMessage = ''; // Reset error message

    // Upload image first
    const imageUploaded = await this.uploadImage();
    if (!imageUploaded) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'User not authenticated. Please log in.';
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    // Log the payload for debugging
    console.log('Posting new book:', this.newBook);

    this.http.post<Book>(
      `${this.baseUrl}/admin/books/add`, 
      this.newBook, // `id` is not included in NewBook type
      { headers }
    ).subscribe({
      next: (response) => {
        this.books.push(response); // Add new book with generated id
        this.newBook = { title: '', author: '', description: '', price: 0, imageUrl: '', stock: 0, isRequired: true };
        this.selectedFile = null; // Reset file input
        this.errorMessage = 'Book added successfully!';
        console.log('Book added:', response); // Debug log
      },
      error: (err) => {
        console.error('Book addition failed', err);
        this.errorMessage = 'Failed to add book: ' + (err.error?.message || 'Unknown error');
      }
    });
  }

  deleteBook(id: number) {
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'User not authenticated. Please log in.';
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.delete<{ message: string, id: number }>(`${this.baseUrl}/admin/books/${id}`, { headers })
      .subscribe({
        next: (response) => {
          this.books = this.books.filter(book => book.id !== id);
          this.errorMessage = response.message; // Show success message
        },
        error: (err) => {
          console.error('Delete failed', err);
          this.errorMessage = 'Failed to delete book: ' + (err.error?.message || 'Unknown error');
        }
      });
  }
}