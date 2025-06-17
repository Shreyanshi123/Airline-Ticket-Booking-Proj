import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditairlineComponent } from './editairline.component';

describe('EditairlineComponent', () => {
  let component: EditairlineComponent;
  let fixture: ComponentFixture<EditairlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditairlineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditairlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
