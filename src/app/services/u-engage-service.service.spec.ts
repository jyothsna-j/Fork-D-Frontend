import { TestBed } from '@angular/core/testing';

import { UEngageServiceService } from './u-engage-service.service';

describe('UEngageServiceService', () => {
  let service: UEngageServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UEngageServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
