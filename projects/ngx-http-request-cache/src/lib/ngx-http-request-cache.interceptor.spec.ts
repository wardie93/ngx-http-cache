import { TestBed } from '@angular/core/testing';

import {
    NgxHttpRequestInterceptor,
} from './ngx-http-request-cache.interceptor';

describe('NgxHttpRequestInterceptor', () => {
    beforeEach(() => TestBed.configureTestingModule({
        providers: [
            NgxHttpRequestInterceptor
        ]
    }));

    it('should be created', () => {
        const interceptor: NgxHttpRequestInterceptor = TestBed.inject(NgxHttpRequestInterceptor);
        expect(interceptor).toBeTruthy();
    });
});
