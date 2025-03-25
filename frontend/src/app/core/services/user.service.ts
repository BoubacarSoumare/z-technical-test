import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UserPreferences {
  sortBy: 'title' | 'author' | 'lastModifiedDate';
  sortOrder: 'asc' | 'desc';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

export interface User {
  userId: string;
  token: string;
  preferences: UserPreferences;
}

export interface AuthResponse {
  userId: string;
  token: string;
  preferences: UserPreferences;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private userSignal = signal<User | null>(null);
  private preferencesSignal = signal<UserPreferences>({
    sortBy: 'lastModifiedDate',
    sortOrder: 'desc'
  });

  constructor(private http: HttpClient) {
    this.loadFromStorage();
  }

  get preferences() {
    return this.preferencesSignal;
  }

  updatePreferences(prefs: Partial<UserPreferences>): void {
    const newPrefs = { ...this.preferencesSignal(), ...prefs };
    this.preferencesSignal.set(newPrefs);
    localStorage.setItem('preferences', JSON.stringify(newPrefs));

    // Update on server if user is logged in
    if (this.userSignal()) {
      this.http.patch(`${this.apiUrl}/preferences`, prefs).subscribe();
    }
  }

  private loadFromStorage() {
    const userJson = localStorage.getItem('user');
    const prefsJson = localStorage.getItem('preferences');

    if (userJson) {
      this.userSignal.set(JSON.parse(userJson));
    }

    if (prefsJson) {
      this.preferencesSignal.set(JSON.parse(prefsJson));
    }
  }

  generateUserId(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/generate`, {})
      .pipe(
        tap(response => {
          const user: User = {
            userId: response.userId,
            token: response.token,
            preferences: this.preferencesSignal() // Use current preferences
          };
          this.userSignal.set(user);
          localStorage.setItem('user', JSON.stringify(user));
        })
      );
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        const user: User = {
          userId: response.userId,
          token: response.token,
          preferences: response.preferences
        };
        this.userSignal.set(user);
        localStorage.setItem('user', JSON.stringify(user));
      })
    );
  }

  signup(credentials: SignupCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, credentials).pipe(
      tap(response => {
        const user: User = {
          userId: response.userId,
          token: response.token,
          preferences: response.preferences
        };
        this.userSignal.set(user);
        localStorage.setItem('user', JSON.stringify(user));
      })
    );
  }

  get currentUser() {
    return this.userSignal;
  }

  getToken(): string | null {
    return this.userSignal()?.token ?? null;
  }

  logout(): void {
    localStorage.removeItem('user');
    this.userSignal.set(null);
  }
}
