import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Book } from '../models/book.model';
import { UserService } from './user.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = `${environment.apiUrl}/books`;
  private booksSignal = signal<Book[]>([]);
  private loadingSignal = signal(false);

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {}

  get books() {
    return this.booksSignal;
  }

  get loading() {
    return this.loadingSignal;
  }

  loadBooks(): void {
    this.loadingSignal.set(true);

    this.http.get<Book[]>(this.apiUrl)
      .subscribe({
        next: (books) => {
          this.booksSignal.set(books);
          this.loadingSignal.set(false);
        },
        error: (error) => {
          console.error('Error loading books:', error);
          this.booksSignal.set([]);
          this.loadingSignal.set(false);
        }
      });
  }

  getBook(id: string): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  createBook(book: Partial<Book>): Observable<Book> {
    const userId = this.userService.currentUser()?.userId;
    if (!userId) {
      throw new Error('No user found');
    }

    return this.http.post<Book>(this.apiUrl, {
      ...book,
      userId
    });
  }

  updateBook(id: string, book: Partial<Book>): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${id}`, book);
  }

  deleteBook(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getBooks(): Observable<Book[]> {
    console.log('Fetching books from:', this.apiUrl);
    return this.http.get<Book[]>(this.apiUrl);
  }
}
