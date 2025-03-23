import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book } from '../models/book.model';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = `${environment.apiUrl}/books`;
  private booksSignal = signal<Book[]>([]);

  books = computed(() => this.booksSignal());

  constructor(private http: HttpClient) {
    this.loadBooks();
  }

  loadBooks(): void {
    this.http.get<Book[]>(this.apiUrl)
      .subscribe(books => this.booksSignal.set(books));
  }

  getBook(id: string) {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  createBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }

  updateBook(id: string, book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${id}`, book);
  }

  deleteBook(id: string): void {
    this.http.delete<void>(`${this.apiUrl}/${id}`)
      .subscribe(() => this.loadBooks());
  }
}
