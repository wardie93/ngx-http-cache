import { TestBed } from '@angular/core/testing';

import { NgxObservableCacheService } from './ngx-observable-cache.service';

describe('NgxObservableCacheService', () => {
  let service: NgxObservableCacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxObservableCacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
