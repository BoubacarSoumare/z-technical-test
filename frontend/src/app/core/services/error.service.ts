import { Injectable } from '@angular/core';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  error = signal<string | null>(null);

  setError(message: string) {
    this.error.set(message);
  }

  clearError() {
    this.error.set(null);
  }
}
