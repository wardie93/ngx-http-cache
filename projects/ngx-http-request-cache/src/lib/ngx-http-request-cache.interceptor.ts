import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import {
    NGX_HTTP_CACHE_OPTIONS,
    NgxHttpRequestBehavior,
    NgxHttpRequestHeaders,
    NgxHttpRequestMethod,
    NgxHttpRequestOptions,
} from './ngx-http-request-cache.options';
import { NgxHttpRequestService } from './ngx-http-request-cache.service';

@Injectable()
export class NgxHttpRequestInterceptor implements HttpInterceptor {
    private defaultBehavior: NgxHttpRequestBehavior;
    private localStorage: boolean;
    private methods: NgxHttpRequestMethod[];

    constructor(
        @Inject(NGX_HTTP_CACHE_OPTIONS)
        private readonly options: NgxHttpRequestOptions,
        private readonly router: Router,
        private readonly cacheService: NgxHttpRequestService
    ) {
        this.defaultBehavior = this.options.behavior!;
        this.localStorage = this.options.localStorage!;
        this.methods = this.options.methods!;

        this.router.events
            .pipe(filter($event => $event instanceof NavigationStart))
            .subscribe(() => {
                this.cacheService.clear(NgxHttpRequestBehavior.PageLevel);
            });
    }

    private getBehaviorEnum(
        enumString: string
    ): NgxHttpRequestBehavior | undefined {
        const enumValues = Object.values(NgxHttpRequestBehavior);

        for (let index = 0; index < enumValues.length; index++) {
            const element = enumValues[index];

            if (element == enumString) {
                return element;
            }
        }

        return undefined;
    }

    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        const headers = request.headers;

        // Get the values for the headers first
        const behaviorOverride = headers.get(NgxHttpRequestHeaders.Cache);
        const localStorageOverride = headers.get(
            NgxHttpRequestHeaders.LocalStorage
        );
        const cacheReplaceHeader = headers.get(NgxHttpRequestHeaders.Replace);

        // Then clear the values out once you know what they are, and create a new request with them removed as they
        // Should not be sent to the server
        Object.values(NgxHttpRequestHeaders).forEach(value =>
            headers.delete(value)
        );

        request = request.clone({
            headers: headers
        });

        const cachingBehavior = behaviorOverride ?? this.defaultBehavior;
        // Have to convert this to the actual enum unfortunately
        const cachingBehaviorEnum = this.getBehaviorEnum(cachingBehavior);

        if (cachingBehaviorEnum == undefined) {
            throw new Error(
                `Caching Behavior (${cachingBehavior}) is not recognised`
            );
        }

        const localStorage =
            localStorageOverride?.toLowerCase() === 'true' ?? this.localStorage;

        // If either the caching behavior is set to none or the behavior override is unset and the HTTP method is not set to cache
        // Then just return the request as normal
        if (
            cachingBehaviorEnum === NgxHttpRequestBehavior.None ||
            (behaviorOverride == undefined &&
                !this.methods.some(
                    m => m.toLowerCase() === request.method.toLowerCase()
                ))
        ) {
            return next.handle(request);
        }

        const requestKey = this.cacheService.createKey(request);

        const existingValue = this.cacheService.get(
            requestKey,
            cachingBehaviorEnum,
            localStorage
        );

        if (existingValue && !cacheReplaceHeader) {
            return of(new HttpResponse(existingValue));
        }

        const result = next.handle(request).pipe(
            tap($event => {
                if ($event instanceof HttpResponse) {
                    this.cacheService.set(
                        requestKey,
                        $event.clone(),
                        cachingBehaviorEnum,
                        localStorage
                    );
                }
            })
        );

        return result;
    }
}
