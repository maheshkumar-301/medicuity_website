import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CodeService } from '../../core/services/code.service';
import { SwalAlertService } from '../../core/services/swal-alert.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-document-processing',
  imports: [CommonModule,FormsModule],
  templateUrl: './document-processing.component.html',
  styleUrl: './document-processing.component.scss'
})
export class DocumentProcessingComponent implements OnInit{

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
  isLoading:boolean = false;
  isShowUpload:boolean = false;
  selectedMarketName:string = 'USA';
  markets!:any;

  constructor(
    private _codeService: CodeService,
    private sanitizer: DomSanitizer,
    private _swalAlertService: SwalAlertService
  ){

  }

  
ngOnInit(): void {
  this.fetchMarkets();
  this.navigateToTest();
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
    formData.append('market', this.selectedMarketName);
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
         this._swalAlertService.errorAlert('Failed', err.error.message);
        this.isSubmittingCode = false;
        this.responses = ''
        this.codeResponse = null;
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
          this.isAskingQuestion = false;
      }, error: (err) => {
          this.isAskingQuestion = false;
   this._swalAlertService.errorAlert('Failed', err.error.message);
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
  this.question = '';
  if (this.fileInput) {
    this.fileInput.nativeElement.value = '';
  }
  this.currentAction = null;

}

 navigateToTest(){
  this.isLoading = true;
      forkJoin([
    this._codeService.getCodingWorking(),
    this._codeService.getRedactWorking()
  ]).subscribe({
    next: ([codingResult, redactResult]) => {
      this.isShowUpload = true;
      this.isLoading = false;
    },
    error: (err) => {
      this.isLoading = false;
      this.isShowUpload = false;
    }
  });
  }

  fetchMarkets(){
    this._codeService.getMarkets().subscribe({
      next: (res:any) => {
        this.markets = res?.response;
        this.selectedMarketName = this.markets[0]?.name;
      }
    })
  }


}
