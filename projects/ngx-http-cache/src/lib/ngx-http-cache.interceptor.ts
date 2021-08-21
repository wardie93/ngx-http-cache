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
    NgxHttpCacheBehavior,
    NgxHttpCacheHeaders,
    NgxHttpCacheOptions,
} from './ngx-http-cache.options';
import { NgxHttpCacheService } from './ngx-http-cache.service';

@Injectable()
export class NgxHttpCacheInterceptor implements HttpInterceptor {
    private defaultBehavior: NgxHttpCacheBehavior;
    private localStorage: boolean;
    private methods: string[];

    constructor(
        @Inject(NGX_HTTP_CACHE_OPTIONS)
        private readonly options: NgxHttpCacheOptions,
        private readonly router: Router,
        private readonly cacheService: NgxHttpCacheService
    ) {
        this.defaultBehavior = this.options.behavior!;
        this.localStorage = this.options.localStorage!;
        this.methods = this.options.methods!;

        this.router.events
            .pipe(filter($event => $event instanceof NavigationStart))
            .subscribe(() => {
                this.cacheService.clear(NgxHttpCacheBehavior.PageLevel);
            });
    }

    private getBehaviorEnum(
        enumString: string
    ): NgxHttpCacheBehavior | undefined {
        const enumValues = Object.values(NgxHttpCacheBehavior);

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
        const behaviorOverride = headers.get(NgxHttpCacheHeaders.Cache);
        const localStorageOverride = headers.get(
            NgxHttpCacheHeaders.LocalStorage
        );
        const cacheResetHeader = headers.get(NgxHttpCacheHeaders.Replace);

        // Then clear the values out once you know what they are, and create a new request with them removed as they
        // Should not be sent to the server
        Object.values(NgxHttpCacheHeaders).forEach(value =>
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
            cachingBehaviorEnum === NgxHttpCacheBehavior.None ||
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

        if (existingValue && !cacheResetHeader) {
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
