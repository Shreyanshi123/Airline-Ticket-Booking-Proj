import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RescheduleFlightComponent } from './reschedule-flight.component';

describe('RescheduleFlightComponent', () => {
  let component: RescheduleFlightComponent;
  let fixture: ComponentFixture<RescheduleFlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RescheduleFlightComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RescheduleFlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
