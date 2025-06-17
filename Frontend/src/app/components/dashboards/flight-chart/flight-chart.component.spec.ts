import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightChartComponent } from './flight-chart.component';

describe('FlightChartComponent', () => {
  let component: FlightChartComponent;
  let fixture: ComponentFixture<FlightChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
