import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-calendly-modal',
  imports: [CommonModule],
  templateUrl: './calendly-modal.component.html',
  styleUrl: './calendly-modal.component.scss'
})
export class CalendlyModalComponent {
    @Input() isModalOpen = false;
  @Input() calendlySafeUrl!: SafeResourceUrl;

  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }

}
