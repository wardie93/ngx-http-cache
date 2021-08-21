import { InjectionToken } from '@angular/core';

export const NGX_OBSERVABLE_CACHE_OPTIONS = new InjectionToken(
    'NGX_OBSERVABLE_CACHE_OPTIONS'
);

export enum NgxHttpCacheHeaders {
    Cache = 'ngx-http-cache',
    NoCache = 'ngx-http-cache-none',
}

export enum NgxHttpCacheBehavior {
    Default = 0,
    PageLevel = 1,
    All = 2
}

export interface NgxHttpCacheOptions {
    behavior: NgxHttpCacheBehavior;
}

export const DEFAULT_OPTIONS: NgxHttpCacheOptions = {
    behavior: NgxHttpCacheBehavior.Default
};
