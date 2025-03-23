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
    this.bookService.getBook(id).subscribe(book => {
      this.bookForm.patchValue(book);
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.bookForm.valid) {
      this.loading.set(true);
      this.error.set(null);

      const book: Book = {
        ...this.bookForm.value,
        lastModifiedDate: new Date()
      };

      try {
        if (this.isEditMode && this.bookId) {
          this.bookService.updateBook(this.bookId, book);
        } else {
          this.bookService.createBook(book);
        }
        this.router.navigate(['/books']);
      } catch (err) {
        this.error.set('Failed to save book. Please try again.');
      } finally {
        this.loading.set(false);
      }
    }
  }
}
