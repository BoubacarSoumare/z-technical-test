import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { authGuard } from './core/guards/auth.guard';
import { BookListComponent } from './features/books/book-list/book-list.component';
import { EditBookComponent } from './features/books/edit-book/edit-book.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'books',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'books',
        loadChildren: () => import('./features/books/books.routes').then(m => m.BOOK_ROUTES),
        canActivate: [authGuard]
      },
      { path: 'books', component: BookListComponent },
      { path: 'books/:id/edit', component: EditBookComponent }
    ]
  }
];
