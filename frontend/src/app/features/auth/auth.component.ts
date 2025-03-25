import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body text-center">
              <h2 class="mb-4">Welcome to Library</h2>
              <div class="d-grid gap-3">
                <button class="btn btn-primary" routerLink="/auth/login">
                  Login
                </button>
                <button class="btn btn-outline-primary" routerLink="/auth/signup">
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AuthComponent {}
