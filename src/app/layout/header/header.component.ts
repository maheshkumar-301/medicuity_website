import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DemoButtonService } from '../../Shared-service/DemoButtonService';

@Component({
  selector: 'app-header',
  imports: [CommonModule,RouterLink,RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
   mobileMenuOpen = false;

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
  onMobileLinkClick(){
    this.mobileMenuOpen=false
    ;
  }


   constructor(private demoButtonService: DemoButtonService) {}

  onRequestDemoClick() {
    this.demoButtonService.updateButtonText('Get Demo Access');
  }


}
