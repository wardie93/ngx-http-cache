import { TestBed } from '@angular/core/testing';

import { NgxHttpRequestService } from './ngx-http-request-cache.service';

describe('NgxHttpRequestService', () => {
    let service: NgxHttpRequestService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(NgxHttpRequestService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
