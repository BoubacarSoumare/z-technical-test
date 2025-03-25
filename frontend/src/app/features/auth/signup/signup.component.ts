import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h2 class="text-center mb-4">Sign Up</h2>
              <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label class="form-label">Name</label>
                  <input
                    type="text"
                    class="form-control"
                    formControlName="name"
                  >
                </div>
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    formControlName="email"
                  >
                </div>
                <div class="mb-3">
                  <label class="form-label">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    formControlName="password"
                  >
                </div>
                <div class="d-grid gap-2">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    [disabled]="signupForm.invalid || loading"
                  >
                    {{ loading ? 'Creating account...' : 'Sign Up' }}
                  </button>
                  <a routerLink="/auth/login" class="text-center">
                    Already have an account? Login
                  </a>
                </div>
                <div *ngIf="error" class="alert alert-danger mt-3">
                  {{ error }}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SignupComponent {
  signupForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.loading = true;
      this.error = '';

      this.userService.signup(this.signupForm.value).subscribe({
        next: () => {
          this.router.navigate(['/books']);
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Error creating account. Please try again.';
          console.error('Signup error:', err);
        }
      });
    }
  }
}
