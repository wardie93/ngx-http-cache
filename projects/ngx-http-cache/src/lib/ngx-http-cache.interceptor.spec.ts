import { TestBed } from '@angular/core/testing';

import { NgxHttpCacheInterceptor } from './ngx-http-cache.interceptor';

describe('NgxHttpCacheInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      NgxHttpCacheInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: NgxHttpCacheInterceptor = TestBed.inject(NgxHttpCacheInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
