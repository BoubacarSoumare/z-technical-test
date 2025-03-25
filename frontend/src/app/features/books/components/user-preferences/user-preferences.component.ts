import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, UserPreferences } from '../../../../core/services/user.service';

@Component({
  selector: 'app-user-preferences',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dropdown">
      <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
        Sort by: {{ preferences().sortBy }}
      </button>
      <ul class="dropdown-menu">
        <li><a class="dropdown-item" (click)="updateSort('title')">Title</a></li>
        <li><a class="dropdown-item" (click)="updateSort('author')">Author</a></li>
        <li><a class="dropdown-item" (click)="updateSort('lastModifiedDate')">Last Modified</a></li>
      </ul>
    </div>
  `
})
export class UserPreferencesComponent {
  preferences;

  constructor(private userService: UserService) {
    this.preferences = this.userService.preferences;
  }

  updateSort(sortBy: UserPreferences['sortBy']): void {
    this.userService.updatePreferences({ sortBy });
  }
}
