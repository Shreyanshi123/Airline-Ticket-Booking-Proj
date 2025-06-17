import { TestBed } from '@angular/core/testing';

import { RecentUserService } from './recent-user.service';

describe('RecentUserService', () => {
  let service: RecentUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecentUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
