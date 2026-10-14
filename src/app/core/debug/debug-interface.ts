import { JwtService } from '../auth/services/jwt.service';
import { UserService, AuthState } from '../auth/services/user.service';
import { User } from '../auth/user.model';

/**
 * Debug interface for testing - exposes app state in a framework-agnostic way.
 * Tests can use this instead of directly accessing localStorage or internal state.
 */
export interface ConduitDebug {
  getToken: () => string | null;
  getAuthState: () => AuthState;
  getCurrentUser: () => User | null;
}

declare global {
  interface Window {
    __conduit_debug__?: ConduitDebug;
  }
}

/**
 * Sets up the debug interface on window.__conduit_debug__
 */
export function setupDebugInterface(jwtService: JwtService, userService: UserService): void {
  let currentAuthState: AuthState = 'loading';
  let currentUser: User | null = null;

  userService.authState.subscribe(state => (currentAuthState = state));
  userService.currentUser.subscribe(user => (currentUser = user));

  window.__conduit_debug__ = {
    getToken: () => jwtService.getToken(),
    getAuthState: () => currentAuthState,
    getCurrentUser: () => currentUser,
  };
}
