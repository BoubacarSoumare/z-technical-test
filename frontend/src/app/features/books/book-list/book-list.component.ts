import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookService } from '../../../core/services/book.service';
import { Book } from '../../../core/models/book.model';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Books</h2>
        <button
          class="btn btn-primary"
          routerLink="/books/new">
          Add New Book
        </button>
      </div>

      <div *ngIf="loading" class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div *ngIf="error" class="alert alert-danger">
        {{ error }}
      </div>

      <div *ngIf="!loading && !error" class="row">
        <div *ngFor="let book of books" class="col-md-4 mb-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">{{ book.title }}</h5>
              <h6 class="card-subtitle mb-2 text-muted">{{ book.author }}</h6>
              <p class="card-text">{{ book.note }}</p>
              <div class="d-flex justify-content-end gap-2">
                <button
                  class="btn btn-sm btn-outline-primary"
                  [routerLink]="['/books', book._id, 'edit']">
                  Edit
                </button>
                <button
                  class="btn btn-sm btn-outline-danger"
                  (click)="deleteBook(book._id)">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  loading = false;
  error = '';

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.loading = true;
    this.error = '';

    this.bookService.getBooks().subscribe({
      next: (books) => {
        console.log('Received books:', books);
        this.books = books;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading books:', err);
        this.error = 'Failed to load books';
        this.loading = false;
      }
    });
  }

  deleteBook(id: string | undefined): void {
    if (!id) {
      console.error('Book ID is undefined');
      return;
    }

    if (confirm('Are you sure you want to delete this book?')) {
      this.loading = true;
      this.bookService.deleteBook(id).subscribe({
        next: () => {
          this.books = this.books.filter(book => book._id !== id);
          this.loading = false;
        },
        error: (err) => {
          console.error('Error deleting book:', err);
          this.error = 'Failed to delete book';
          this.loading = false;
        }
      });
    }
  }
}
