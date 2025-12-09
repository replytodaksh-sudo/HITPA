// File: src/services/alertService.ts
import { BehaviorSubject, Observable } from 'rxjs';

// Declare alertify for TypeScript
declare let alertify: any;

// ==================== INTERFACES ====================
export type ConfirmStatus = 'Ok' | 'Cancel' | '';

export interface AlertOptions {
  title?: string;
  message: string;
  onOk?: () => void;
  onCancel?: () => void;
}

// ==================== SERVICE ====================
class AlertService {
  private confirmStatus$ = new BehaviorSubject<ConfirmStatus>('');

  /**
   * Show success/info alert dialog
   * @param message - Message to display
   * @param title - Dialog title (default: "Alert")
   */
  showAlertSuccess(message: string, title: string = 'Alert'): void {
    try {
      if (typeof alertify !== 'undefined') {
        alertify.alert(title, message);
      } else {
        // Fallback to native alert if alertify not loaded
        alert(`${title}: ${message}`);
      }
    } catch (error) {
      console.error('Error in showAlertSuccess:', error);
      alert(`${title}: ${message}`);
    }
  }

  /**
   * Show error alert dialog
   * @param message - Error message to display
   * @param title - Dialog title (default: "Error")
   */
  showAlertError(message: string, title: string = 'Error'): void {
    try {
      if (typeof alertify !== 'undefined') {
        alertify.alert(title, message);
      } else {
        alert(`${title}: ${message}`);
      }
    } catch (error) {
      console.error('Error in showAlertError:', error);
      alert(`${title}: ${message}`);
    }
  }

  /**
   * Show confirmation dialog with Ok/Cancel buttons
   * @param message - Message to display
   * @param title - Dialog title (default: "Ask")
   * @returns Observable that emits "Ok" or "Cancel" when user responds
   */
  showAlertConfirm(
    message: string,
    title: string = 'Ask'
  ): Observable<ConfirmStatus> {
    try {
      if (typeof alertify !== 'undefined') {
        alertify.confirm(
          title,
          message,
          () => {
            this.setConfirmStatus('Ok');
          },
          () => {
            this.setConfirmStatus('Cancel');
          }
        );
      } else {
        // Fallback to native confirm
        const result = window.confirm(`${title}: ${message}`);
        this.setConfirmStatus(result ? 'Ok' : 'Cancel');
      }
    } catch (error) {
      console.error('Error in showAlertConfirm:', error);
      const result = window.confirm(`${title}: ${message}`);
      this.setConfirmStatus(result ? 'Ok' : 'Cancel');
    }

    return this.confirmStatus$.asObservable();
  }

  /**
   * Show confirmation dialog with custom options
   * @param options - Alert options with callbacks
   * @returns Observable that emits "Ok" or "Cancel"
   */
  showAlertConfirmWithCallbacks(options: AlertOptions): Observable<ConfirmStatus> {
    try {
      if (typeof alertify !== 'undefined') {
        alertify.confirm(
          options.title || 'Confirm',
          options.message,
          () => {
            this.setConfirmStatus('Ok');
            if (options.onOk) options.onOk();
          },
          () => {
            this.setConfirmStatus('Cancel');
            if (options.onCancel) options.onCancel();
          }
        );
      } else {
        const result = window.confirm(
          `${options.title || 'Confirm'}: ${options.message}`
        );
        this.setConfirmStatus(result ? 'Ok' : 'Cancel');
        if (result && options.onOk) options.onOk();
        if (!result && options.onCancel) options.onCancel();
      }
    } catch (error) {
      console.error('Error in showAlertConfirmWithCallbacks:', error);
      const result = window.confirm(
        `${options.title || 'Confirm'}: ${options.message}`
      );
      this.setConfirmStatus(result ? 'Ok' : 'Cancel');
    }

    return this.confirmStatus$.asObservable();
  }

  /**
   * Show notification toast (if alertify supports it)
   * @param message - Message to display
   * @param type - Notification type: 'success' | 'error' | 'warning' | 'info'
   * @param duration - Duration in seconds (default: 3)
   */
  showNotification(
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info',
    duration: number = 3
  ): void {
    try {
      if (typeof alertify !== 'undefined' && alertify.notify) {
        alertify.notify(message, type, duration);
      } else if (typeof alertify !== 'undefined') {
        // Fallback to alert if notify not available
        alertify.alert('Notification', message);
      } else {
        console.log(`[${type.toUpperCase()}]: ${message}`);
      }
    } catch (error) {
      console.error('Error in showNotification:', error);
      console.log(`[${type.toUpperCase()}]: ${message}`);
    }
  }

  /**
   * Set confirmation status (internal use)
   * @param status - Status to set ("Ok" or "Cancel")
   */
  private setConfirmStatus(status: ConfirmStatus): void {
    this.confirmStatus$.next(status);
  }

  /**
   * Get confirmation status as observable
   * @returns Observable of confirmation status
   */
  getConfirmStatus(): Observable<ConfirmStatus> {
    return this.confirmStatus$.asObservable();
  }

  /**
   * Reset confirmation status to empty string
   */
  resetConfirmStatus(): void {
    this.confirmStatus$.next('');
  }

  /**
   * Show promise-based confirmation (modern async/await approach)
   * @param message - Message to display
   * @param title - Dialog title
   * @returns Promise that resolves to true (Ok) or false (Cancel)
   */
  async confirmAsync(message: string, title: string = 'Confirm'): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        if (typeof alertify !== 'undefined') {
          alertify.confirm(
            title,
            message,
            () => resolve(true),
            () => resolve(false)
          );
        } else {
          resolve(window.confirm(`${title}: ${message}`));
        }
      } catch (error) {
        console.error('Error in confirmAsync:', error);
        resolve(window.confirm(`${title}: ${message}`));
      }
    });
  }
}

// Export singleton instance
export const alertService = new AlertService();
export default alertService;