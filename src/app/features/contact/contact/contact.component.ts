import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CalendlyModalComponent } from '../../calendly-modal/calendly-modal.component';
import { EmailService } from '../../../core/services/email.service';
import { SwalAlertService } from '../../../core/services/swal-alert.service';

@Component({
  selector: 'app-contact',
  imports: [CommonModule, ReactiveFormsModule, FormsModule,CalendlyModalComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
    isModalOpen = false;
  calendlySafeUrl!: SafeResourceUrl;
  info: String = 'info@medicuity.com';
  loading: boolean = false;


  formData = {
    firstName: '',
    lastName: '',
    email: '',
    organization: '',
    phone: '',
    message: '',
  };

  captcha: string = '';
  captchaInput: string = '';
  captchaVerified: boolean = false;

  
  constructor(
    private sanitizer: DomSanitizer,private emailService: EmailService, private swalAlertService:SwalAlertService){
    const calendlyUrl = 'https://calendly.com/medicuity-info/30min';
    this.calendlySafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(calendlyUrl);
  }

    openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  ngOnInit() {
    this.generateCaptcha();
  }

  generateCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    this.captcha = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    this.captchaInput = '';
    this.captchaVerified = false;
  }

  captchaMessage: string = '';
  captchaMessageClass: string = ''; 

  verifyCaptcha() {
    if (this.captchaInput.trim().toUpperCase() === this.captcha) {
      this.captchaVerified = true;
      this.captchaMessage = '✅ CAPTCHA Verified!';
      this.captchaMessageClass = 'text-green-600';
    } else {
      this.captchaVerified = false;
      this.captchaMessage = '❌ CAPTCHA Incorrect!';
      this.captchaMessageClass = 'text-red-600';
      this.generateCaptcha();
    }
  }

onSubmit(form: any) {
  if (!this.captchaVerified) {
    this.captchaMessage = '⚠️ Please verify CAPTCHA before submitting!';
    this.captchaMessageClass = 'text-yellow-600';
    return;
  }

  if (this.loading) return; // Prevent multiple clicks

  this.sendEmail(form);
}

sendEmail(form: any) {
  this.loading = true; // start loading

  const payload = {
    ...this.formData,
    formType: 'contact',
  };

  this.emailService.sendEmail(payload).subscribe({
    next: () => {
      this.swalAlertService.successAlert('Success', 'Message sent successfully. We will contact you soon.');

      this.formData = {
        firstName: '',
        lastName: '',
        email: '',
        organization: '',
        phone: '',
        message: '',
      };

      this.generateCaptcha();
      this.captchaMessage = '';
      form.resetForm(); // reset form
      this.loading = false; // stop loading
    },
    error: (err) => {
      const detail = err.error?.detail;
      let errorMessage = 'Failed to send email. Please try again.';
      if (Array.isArray(detail)) {
        const emailError = detail.find((e) => e.loc?.includes('email'));
        if (emailError) {
          errorMessage = 'Please enter a valid email address.';
        }
      }
      this.swalAlertService.errorAlert('Error', errorMessage);
      this.loading = false; // stop loading
    },
  });
}

}
