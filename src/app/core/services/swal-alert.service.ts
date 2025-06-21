import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SwalAlertService {

  constructor() { }

  warningAlert(title: string, message: string) {
    Swal.fire({
      icon: 'warning',
      title: title,
      text: message,
    });
  }

  successAlert(title: string, message: string) {
    Swal.fire({
      icon: 'success', // Fixed icon type
      title: title,
      text: message,
    });
  }

  errorAlert(title: string, message: string) {
    Swal.fire({
      icon: 'error',
      title: title,
      text: message,
    });
  }

  infoAlert(title: string, message: string) {
    Swal.fire({
      icon: 'info',
      title: title,
      text: message,
    });
  }
}
