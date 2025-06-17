import { TestBed } from '@angular/core/testing';

import { UsersbookingsService } from './usersbookings.service';

describe('UsersbookingsService', () => {
  let service: UsersbookingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersbookingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
