import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './core/services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HttpClientModule
  ],
  template: `
    <nav class="navbar navbar-expand navbar-dark bg-dark" *ngIf="userService.currentUser()">
      <div class="container">
        <a class="navbar-brand">Library</a>
        <button class="btn btn-outline-light" (click)="logout()">Logout</button>
      </div>
    </nav>

    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  title = 'Personal Library';

  constructor(public userService: UserService) {}

  logout(): void {
    this.userService.logout();
  }
}
