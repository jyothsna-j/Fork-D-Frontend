import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentApprovalComponent } from './payment-approval.component';

describe('PaymentApprovalComponent', () => {
  let component: PaymentApprovalComponent;
  let fixture: ComponentFixture<PaymentApprovalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentApprovalComponent]
    });
    fixture = TestBed.createComponent(PaymentApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
