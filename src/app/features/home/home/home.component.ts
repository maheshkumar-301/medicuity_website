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
  selectedFileName: string | null = null;
  selectedFileType: string | null = null;
  uploadedFile: File | null = null;
  fieldName: string = '';
  docType: string | null = null;
  responses!: any;
  question!: string;
  redactResponse!: any;
  codeResponse!: any;
  isAskingQuestion: boolean = false;
  isSubmittingRedact = false;
  isSubmittingCode = false;
  @ViewChild('fileInput') fileInput!: ElementRef;
  currentAction: 'redact' | 'code' | 'ask' | null = null;



  constructor(
    private demoButtonService: DemoButtonService,
    private _codeService: CodeService,
    private sanitizer: DomSanitizer,
    private _swalAlertService: SwalAlertService
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





  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFile(input.files[0]);
    }
    this.resetValues();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.processFile(event.dataTransfer.files[0]);
    }
    this.resetValues();
  }

  processFile(file: File): void {
    let docType = '';
    let fieldName = '';

    // Get the MIME type or fallback to file extension
    const mime = file.type;
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (mime === 'application/pdf' || extension === 'pdf') {
      docType = 'pdf';
      fieldName = 'pdf_file';
    } else if (
      mime === 'application/rtf' ||
      mime === 'text/rtf' ||
      extension === 'rtf'
    ) {
      docType = 'rtf';
      fieldName = 'rtf_file';
    } else if (
      mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      extension === 'docx'
    ) {
      docType = 'docx';
      fieldName = 'docx_file';
    } else {
this._swalAlertService.warningAlert(
  'Unsupported File',
  'Only PDF, DOCX, and RTF files are allowed.'
);
      return;
    }

    this.selectedFileName = file.name;
    this.uploadedFile = file;
    this.docType = docType;
    this.fieldName = fieldName;
  }



  onSubmit(val: string): void {
    if (!this.uploadedFile || !this.docType) {
    this._swalAlertService.warningAlert('Missing File', 'Please upload a valid document before redacting.');
      return;
    }
    this.currentAction = val === 'code' ? 'code' : 'redact';
   if (val === 'code') {
    // If already redacted, skip redaction
    if (this.redactResponse) {
      this.code(this.redactResponse);
      return;
    }

    // Prevent multiple clicks
    if (this.isSubmittingRedact || this.isSubmittingCode) return;
    this.isSubmittingRedact = true;
  } else {
    if (this.isSubmittingRedact) return;
    this.isSubmittingRedact = true;
  }
    const formData = new FormData();
    formData.append('docType', this.docType);
    formData.append(this.fieldName, this.uploadedFile); // field name matches docType

    this._codeService.redact(formData).subscribe({
      next: (response) => {
        if (val == 'code') {
          this.redactResponse = response.redactedText;
          this.code(response.redactedText);
        } else{
          this.responses = response.redactedText;
          this.redactResponse = response.redactedText;
        }
        this.isSubmittingRedact = false;
        console.log('Redaction response:', response);
        // Optionally: show result or message to user
      },
      error: (error) => {
        console.error('Redaction failed:', error);
        this.isSubmittingRedact = false;
      this._swalAlertService.errorAlert('Redaction Failed', 'Something went wrong while redacting the document.');
      }
    });
  }

  code(content: any) {
    if (!this.redactResponse) {
      this._swalAlertService.warningAlert('Missing Redaction', 'Please run redact before coding.');
      return;
    }
     if (this.isSubmittingCode) return;
    this.isSubmittingCode = true;
    const formData = new FormData();
    formData.append('content', content);
    this._codeService.codes(formData).subscribe({
      next: (response) => {
        try{
          const parsed = JSON.parse(response.response);
          this.responses = JSON.stringify(parsed, null, 2);
          this.codeResponse = response.response;
          this.isSubmittingCode = false;
        }catch{
          this.responses = response.response;
          this.isSubmittingCode = false;
        }
      }, error: (err) => {
        this.isSubmittingCode = false;
      }
    })
  }

  askQuestion() {
    this.currentAction = 'ask';
    if (this.isAskingQuestion) return;
    const formData = new FormData();
    const sourceContent = this.codeResponse || this.redactResponse;
    if (!sourceContent || !this.question) {
  this._swalAlertService.warningAlert('Missing Input', 'Please run redact/code and enter a question.');
      return;
    }
    this.isAskingQuestion = true;
    formData.append('content', sourceContent);
    formData.append('question', this.question);
    this._codeService.askQuestion(formData).subscribe({
      next: (response) => {
        this.responses = response.answer;
      }, error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.isAskingQuestion = false;
      }


    })

  }

  resetValues(){
    // Reset state for new file upload
  this.redactResponse = null;
  this.codeResponse = null;
  this.responses = '';
  this.question = '';
  this.isSubmittingRedact = false;
  this.isSubmittingCode = false;
  this.isAskingQuestion = false;
  this.currentAction = null;

  }

  clearUploadedFile(): void {
  this.uploadedFile = null;
  this.selectedFileName = '';
  this.redactResponse = null;
  this.codeResponse = null;
  this.responses = '';
  if (this.fileInput) {
    this.fileInput.nativeElement.value = '';
  }
  this.currentAction = null;

}

}