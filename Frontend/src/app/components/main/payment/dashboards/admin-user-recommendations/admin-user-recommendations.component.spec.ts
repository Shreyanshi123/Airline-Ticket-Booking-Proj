import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserRecommendationsComponent } from './admin-user-recommendations.component';

describe('AdminUserRecommendationsComponent', () => {
  let component: AdminUserRecommendationsComponent;
  let fixture: ComponentFixture<AdminUserRecommendationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUserRecommendationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUserRecommendationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
