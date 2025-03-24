import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Book } from '../models/book.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = `${environment.apiUrl}/books`;
  private booksSignal = signal<Book[]>([]);

  books = this.booksSignal;

  constructor(private http: HttpClient) {
    this.loadBooks();
  }

  loadBooks(): void {
    this.http.get<Book[]>(this.apiUrl)
      .subscribe(books => this.booksSignal.set(books));
  }

  getBook(id: string): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  createBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book).pipe(
      tap(() => this.loadBooks())
    );
  }

  updateBook(id: string, book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${id}`, book).pipe(
      tap(() => this.loadBooks())
    );
  }

  deleteBook(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentBooks = this.booksSignal();
        this.booksSignal.set(currentBooks.filter(book => book._id !== id));
      })
    );
  }
}
