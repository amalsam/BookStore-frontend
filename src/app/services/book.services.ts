// src/app/services/book.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:8081/api/books'; // Replace with your API URL

  constructor(private http: HttpClient) {}

  getBooks(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addToCart(bookId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/cart`, { bookId });
  }
}