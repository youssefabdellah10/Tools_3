import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssignOrderToCourierComponent } from './assign-order-to-courier.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

describe('AssignOrderToCourierComponent', () => {
  let component: AssignOrderToCourierComponent;
  let fixture: ComponentFixture<AssignOrderToCourierComponent>;
  let httpMock: HttpTestingController;

  const mockOrders = [
    { id: 1, pickup_location: 'Location A', dropoff_location: 'Location B', package_details: 'Package 1', status: 'Pending', assignedCourier: { id: 1, name: 'Courier A' } },
    { id: 2, pickup_location: 'Location C', dropoff_location: 'Location D', package_details: 'Package 2', status: 'In Transit', assignedCourier: { id: 2, name: 'Courier B' } },
  ];

  const mockCouriers = [
    { id: 1, name: 'Courier A' },
    { id: 2, name: 'Courier B' },
    { id: 3, name: 'Courier C' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule],
      declarations: [AssignOrderToCourierComponent],
      providers: [{ provide: Router, useValue: { navigate: () => {} } }]
    }).compileComponents();

    fixture = TestBed.createComponent(AssignOrderToCourierComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch assigned orders on initialization', () => {
    component.ngOnInit();

    const req = httpMock.expectOne('http://localhost:5000/admin/assigned-orders');
    expect(req.request.method).toBe('GET');
    req.flush(mockOrders);

    fixture.detectChanges();
    expect(component.orders).toEqual(mockOrders);
  });

  it('should fetch couriers', () => {
    component.fetchCouriers();

    const req = httpMock.expectOne('http://localhost:5000/admin/couriers');
    expect(req.request.method).toBe('GET');
    req.flush(mockCouriers);

    fixture.detectChanges();
    expect(component.couriers).toEqual(mockCouriers);
  });

  it('should reassign order', () => {
    component.orders = mockOrders;

    const newCourierId = 3; 
    component.reassignOrder(1, newCourierId);

    const req = httpMock.expectOne('http://localhost:5000/admin/reassign-order');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ orderId: 1, newCourierId });
    req.flush({});

    
    component.fetchAssignedOrders();
    const fetchReq = httpMock.expectOne('http://localhost:5000/admin/assigned-orders');
    expect(fetchReq.request.method).toBe('GET');
    fetchReq.flush(mockOrders); 

    expect(component.selectedCourierId).toBeNull();
  });
});
