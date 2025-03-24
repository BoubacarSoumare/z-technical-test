import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap/alert';
import { BookService } from '../../../core/services/book.service';
import { Book } from '../../../core/models/book.model';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    AlertModule
  ],
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.scss']
})
export class BookFormComponent implements OnInit {
  bookForm: FormGroup;
  isEditMode = false;
  bookId: string | null = null;
  submitted = false;
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.bookForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      author: ['', [Validators.required, Validators.maxLength(100)]],
      note: ['', [Validators.maxLength(1000)]]
    });
  }

  get f() {
    return this.bookForm.controls;
  }

  hasError(field: string): boolean {
    const control = this.f[field];
    return control.invalid && (control.dirty || control.touched);
  }

  ngOnInit(): void {
    this.bookId = this.route.snapshot.paramMap.get('id');
    if (this.bookId) {
      this.isEditMode = true;
      this.loadBook(this.bookId);
    }
  }

  loadBook(id: string): void {
    this.loading.set(true);
    this.bookService.getBook(id).subscribe({
      next: (book) => {
        this.bookForm.patchValue(book);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading book:', err);
        this.error.set('Failed to load book');
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (!this.bookForm.valid) return;

    this.loading.set(true);
    this.error.set(null);

    const book: Book = {
      ...this.bookForm.value,
      lastModifiedDate: new Date()
    };

    const request$ = this.isEditMode && this.bookId
      ? this.bookService.updateBook(this.bookId, book)
      : this.bookService.createBook(book);

    request$.subscribe({
      next: () => {
        this.router.navigate(['/books']);
      },
      error: (err) => {
        console.error('Error saving book:', err);
        this.error.set('Failed to save book. Please try again.');
        this.loading.set(false);
      }
    });
  }
}
