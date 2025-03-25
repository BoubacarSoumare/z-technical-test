import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../../core/services/book.service';
import { Book } from '../../../core/models/book.model';

@Component({
  selector: 'app-edit-book',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <h2>Edit Book</h2>

      <form (ngSubmit)="onSubmit()" *ngIf="book">
        <div class="mb-3">
          <label for="title" class="form-label">Title</label>
          <input
            type="text"
            class="form-control"
            id="title"
            [(ngModel)]="book.title"
            name="title"
            required>
        </div>

        <div class="mb-3">
          <label for="author" class="form-label">Author</label>
          <input
            type="text"
            class="form-control"
            id="author"
            [(ngModel)]="book.author"
            name="author"
            required>
        </div>

        <div class="mb-3">
          <label for="note" class="form-label">Note</label>
          <textarea
            class="form-control"
            id="note"
            [(ngModel)]="book.note"
            name="note"
            required></textarea>
        </div>

        <div class="d-flex gap-2">
          <button type="submit" class="btn btn-primary">Save Changes</button>
          <button type="button" class="btn btn-secondary" (click)="onCancel()">Cancel</button>
        </div>
      </form>

      <div *ngIf="error" class="alert alert-danger mt-3">
        {{ error }}
      </div>
    </div>
  `
})
export class EditBookComponent implements OnInit {
  book?: Book;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.bookService.getBook(id).subscribe({
        next: (book) => this.book = book,
        error: (err) => {
          console.error('Error loading book:', err);
          this.error = 'Failed to load book';
        }
      });
    }
  }

  onSubmit(): void {
    if (!this.book) return;

    this.bookService.updateBook(this.book._id, this.book).subscribe({
      next: () => this.router.navigate(['/books']),
      error: (err) => {
        console.error('Error updating book:', err);
        this.error = 'Failed to update book';
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/books']);
  }
}
