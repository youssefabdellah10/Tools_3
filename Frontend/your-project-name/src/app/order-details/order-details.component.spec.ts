import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderDetailsComponent } from './order-details.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('OrderDetailsComponent', () => {
  let component: OrderDetailsComponent;
  let fixture: ComponentFixture<OrderDetailsComponent>;
  let mockActivatedRoute: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('123'),
        },
      },
    };
    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
    };

    await TestBed.configureTestingModule({
      declarations: [OrderDetailsComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch order details on init', () => {
    spyOn(component, 'fetchOrderDetails').and.callThrough();
    component.ngOnInit();
    expect(component.fetchOrderDetails).toHaveBeenCalledWith('123');
  });

  it('should handle errors when fetching order details', () => {
    spyOn(window, 'fetch').and.returnValue(Promise.reject('Error fetching order details'));
    component.fetchOrderDetails('123');
    fixture.detectChanges();
    expect(component.errorMessage).toBe('Error fetching order details: Error fetching order details');
  });

  it('should navigate to "my-orders" after cancelling order', () => {
    spyOn(window, 'fetch').and.returnValue(Promise.resolve({ ok: true }));
    component.cancelOrder();
    fixture.detectChanges();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/my-orders']);
  });

  it('should show error message when canceling order fails', () => {
    spyOn(window, 'fetch').and.returnValue(Promise.reject('Error cancelling order'));
    component.cancelOrder();
    fixture.detectChanges();
    expect(component.errorMessage).toBe('Error cancelling order: Error cancelling order');
  });
});
