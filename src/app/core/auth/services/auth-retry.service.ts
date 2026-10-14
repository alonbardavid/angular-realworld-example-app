import { Injectable } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { JwtService } from './jwt.service';

/**
 * AuthRetryService - Retries auth initialization while the server is unavailable.
 *
 * ## Auto-Retry
 *
 * When in 'unavailable' state, the service automatically retries with exponential
 * backoff: 2s → 4s → 8s → 16s → 16s → ... (capped at 16s, retries indefinitely).
 * The UI shows "Connecting..." while retrying. User can also just reload the page.
 */
@Injectable({ providedIn: 'root' })
export class AuthRetryService {
  private retryAttempt = 0;
  private retrySubscription: Subscription | null = null;

  constructor(private readonly jwtService: JwtService) {}

  /**
   * Schedule auto-retry with exponential backoff: 2s, 4s, 8s, 16s, 16s, 16s...
   */
  schedule(retry: () => void): void {
    this.cancel();

    if (!this.jwtService.getToken()) {
      return; // No token, nothing to retry
    }

    // Calculate delay: 2, 4, 8, 16, 16, 16... (capped at 16s)
    const delaySeconds = Math.min(2 * Math.pow(2, this.retryAttempt), 16);
    this.retryAttempt++;

    this.retrySubscription = timer(delaySeconds * 1000).subscribe(() => {
      if (this.jwtService.getToken()) {
        retry();
      }
    });
  }

  /**
   * Cancel any pending retry
   */
  cancel(): void {
    if (this.retrySubscription) {
      this.retrySubscription.unsubscribe();
      this.retrySubscription = null;
    }
  }

  /**
   * Cancel any pending retry and restart the backoff from 2s
   */
  reset(): void {
    this.cancel();
    this.retryAttempt = 0;
  }
}
