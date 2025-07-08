import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RecaptchaModule } from 'ng-recaptcha';
import { Subscription } from 'rxjs';
import { DemoButtonService } from '../../../Shared-service/DemoButtonService';
import { CodeService } from '../../../core/services/code.service';
import Swal from 'sweetalert2';
import { SwalAlertService } from '../../../core/services/swal-alert.service';
import { Router } from '@angular/router';


declare var grecaptcha: any;

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, RecaptchaModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})



export class HomeComponent implements OnInit, OnDestroy {
  isModalOpen = false;
  calendlySafeUrl: SafeResourceUrl;
  private subscription!: Subscription;




  constructor(
    private demoButtonService: DemoButtonService,
    private _codeService: CodeService,
    private sanitizer: DomSanitizer,
    private _swalAlertService: SwalAlertService,
    private _router:Router
  ) {
    const calendlyUrl = 'https://calendly.com/medicuity-info/30min';
    this.calendlySafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(calendlyUrl);
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  demoButtonText = 'Get Demo Access';

  onStartTrialClick(text: string) {
    this.demoButtonText = text
  }

  resolved(captchaResponse: any) {
    console.log(`Resolved captcha with response: ${captchaResponse}`);
  }


  formData = {
    firstName: '',
    lastName: '',
    email: '',
    organization: '',
    phone: ''
  };

  sendEmail() {


    const subject = encodeURIComponent(`${this.demoButtonText}`);
    const body = encodeURIComponent(
      `Request Type: ${this.demoButtonText}\n` +
      `First Name: ${this.formData.firstName}\n` +
      `Last Name: ${this.formData.lastName}\n` +
      `Email: ${this.formData.email}\n` +
      `Organization: ${this.formData.organization}\n` +
      `Phone: ${this.formData.phone}\n`

    );

    const mailtoLink = `mailto:info@medicuity.com?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
  }


  captchaVerified = false;
  captchaToken = '';

  currentSlide = 0;
  autoSlideInterval: any;


  scrollToDemoForm() {
    const element = document.getElementById('demo-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  slides = [
    {
      svgPaths: ['M13 2L3 14h9l-1 8L21 10h-9l1-8z'],
      title: 'No Historical Data Required',
      description: 'Get started immediately with just your guidelines and a small sample set. Our advanced NLP leverages proven LLMs, not unreliable machine learning from questionable data.',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      svgPaths: ['M3 15a4 4 0 0 1 4-4h1.26A6 6 0 0 1 20 13a4 4 0 0 1 0 8H7a4 4 0 0 1-4-4z'
      ],
      title: 'Your Cloud, Your Control',
      description: 'Deploy our solution directly in your Azure or AWS environment. Maintain complete control over your data while leveraging enterprise-grade AI capabilities.',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      svgPaths: ['M4 13H20V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V13Z',
        'M2 9H22V13H2V9Z',
        'M12 5L12 22',
        'M12 5.5C12 3.567 10.433 2 8.5 2C6.567 2 5 3.567 5 5.5C5 7.433 6.567 9 8.5 9',
        'M15.5 9C17.433 9 19 7.433 19 5.5C19 3.567 17.433 2 15.5 2C13.567 2 12 3.567 12 5.5'],
      title: 'Free for Small Practices',
      description: 'Individual physicians with fewer than 175 appointments monthly get full access to our coding platform at absolutely no cost. Scale your practice worry-free.',
      bgColor: 'bg-violet-100',
      iconColor: 'text-violet-600'
    },

    {
      svgPaths: ['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2',
        'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
        'M23 21v-2a4 4 0 0 0-3-3.87',
        'M16 3.13a4 4 0 1 1 0 7.75'],
      title: 'Secure Remote Coding',
      description: 'Safely utilize contract coders worldwide without network access risks. All PII is automatically hidden and never permanently stored in our platform.',
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600'
    }
  ];


  email: string = 'info@medicuity.com';



  ngOnInit() {
    this.startAutoSlide();
    this.subscription = this.demoButtonService.buttonText$.subscribe(
      (text) => {
        this.demoButtonText = text;
      }
    );
  }

  ngOnDestroy() {
    this.stopAutoSlide();
    this.subscription.unsubscribe();
  }

  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 3000);
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) clearInterval(this.autoSlideInterval);
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  navigateToTest(){
this._router.navigateByUrl('/quick-test')
  }

}