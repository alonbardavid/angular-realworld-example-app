import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { UserService } from './services/user.service';

/**
 * Guard that requires authentication. Redirects to /login if not authenticated.
 */
export const requireAuth = () => {
  const router = inject(Router);
  return inject(UserService).isAuthenticated.pipe(map(isAuth => isAuth || router.createUrlTree(['/login'])));
};

/**
 * Guard for guest-only pages (login, register). Redirects to / if already authenticated.
 */
export const requireGuest = () => {
  const router = inject(Router);
  return inject(UserService).isAuthenticated.pipe(map(isAuth => !isAuth || router.createUrlTree(['/'])));
};
