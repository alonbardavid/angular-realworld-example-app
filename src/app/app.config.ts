import { ApplicationConfig, inject, provideAppInitializer, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { JwtService } from './core/auth/services/jwt.service';
import { UserService } from './core/auth/services/user.service';
import { apiInterceptor } from './core/interceptors/api.interceptor';
import { tokenInterceptor } from './core/interceptors/token.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { EMPTY } from 'rxjs';
import { setupDebugInterface } from './core/debug/debug-interface';

/**
 * App initializer: checks auth state at startup.
 *
 * - No token → purgeAuth() to exit 'loading' state → 'unauthenticated'
 * - Token exists → getCurrentUser() to validate it:
 *     - Success → 'authenticated'
 *     - 4XX → 'unauthenticated' (invalid token, cleared)
 *     - 5XX → 'unavailable' (server down, token kept, auto-retry)
 */
export function initAuth(jwtService: JwtService, userService: UserService) {
  return () => {
    setupDebugInterface(jwtService, userService);

    if (jwtService.getToken()) {
      return userService.getCurrentUser();
    } else {
      userService.purgeAuth();
      return EMPTY;
    }
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([apiInterceptor, tokenInterceptor, errorInterceptor])),
    provideAppInitializer(() => {
      const initializerFn = initAuth(inject(JwtService), inject(UserService));
      return initializerFn();
    }),
  ],
};
