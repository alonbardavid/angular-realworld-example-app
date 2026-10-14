import { Routes } from '@angular/router';
import { requireAuth, requireGuest } from './core/auth/auth.guards';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/article/pages/home/home.component'),
  },
  {
    path: 'tag/:tag',
    loadComponent: () => import('./features/article/pages/home/home.component'),
  },
  {
    path: 'login',
    loadComponent: () => import('./core/auth/auth.component'),
    canActivate: [requireGuest],
  },
  {
    path: 'register',
    loadComponent: () => import('./core/auth/auth.component'),
    canActivate: [requireGuest],
  },
  {
    path: 'settings',
    loadComponent: () => import('./features/settings/settings.component'),
    canActivate: [requireAuth],
  },
  {
    path: 'profile',
    loadChildren: () => import('./features/profile/profile.routes'),
  },
  {
    path: 'editor',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/article/pages/editor/editor.component'),
        canActivate: [requireAuth],
      },
      {
        path: ':slug',
        loadComponent: () => import('./features/article/pages/editor/editor.component'),
        canActivate: [requireAuth],
      },
    ],
  },
  {
    path: 'article/:slug',
    loadComponent: () => import('./features/article/pages/article/article.component'),
  },
];
