import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/app-layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/home/home.routes').then((m) => m.HOME_ROUTES),
      },
      {
        path: 'about',
        loadChildren: () =>
          import('./features/about/about.routes').then((m) => m.ABOUT_ROUTES),
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./features/contact/contact/contact.component').then((m) => m.ContactComponent),
      },
      {
        path: 'solutions',
        loadComponent: () =>
          import('./features/solutions/solutions/solutions.component').then((m) => m.SolutionsComponent),
      },
      {
        path: 'quick-test',
        loadComponent: () =>
          import('./features/document-processing/document-processing.component').then((m) => m.DocumentProcessingComponent),
      },
    ]
  },
  {
    path: '**',
    redirectTo: '',
  },
];
