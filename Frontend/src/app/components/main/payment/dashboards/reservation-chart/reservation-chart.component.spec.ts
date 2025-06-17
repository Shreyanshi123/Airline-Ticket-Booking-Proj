import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationChartComponent } from './reservation-chart.component';

describe('ReservationChartComponent', () => {
  let component: ReservationChartComponent;
  let fixture: ComponentFixture<ReservationChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
