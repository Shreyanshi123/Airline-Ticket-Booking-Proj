import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularFlightsComponent } from './popular-flights.component';

describe('PopularFlightsComponent', () => {
  let component: PopularFlightsComponent;
  let fixture: ComponentFixture<PopularFlightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopularFlightsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopularFlightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
