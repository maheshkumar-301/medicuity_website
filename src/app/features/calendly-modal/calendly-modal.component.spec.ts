import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendlyModalComponent } from './calendly-modal.component';

describe('CalendlyModalComponent', () => {
  let component: CalendlyModalComponent;
  let fixture: ComponentFixture<CalendlyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendlyModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendlyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
