type NotificationCallback = (result: 'Ok' | 'Cancel') => void;

class NotificationService {
  showAlertSuccess(message: string): void {
    alert(message);
  }

  showAlertError(message: string): void {
    alert(message);
  }

  showAlertConfirm(message: string): Promise<'Ok' | 'Cancel'> {
    return new Promise((resolve) => {
      const result = window.confirm(message);
      resolve(result ? 'Ok' : 'Cancel');
    });
  }

  // For better UX, you can integrate with a toast library like:
  // react-toastify, notistack, or MUI Snackbar
}

export const notificationService = new NotificationService();