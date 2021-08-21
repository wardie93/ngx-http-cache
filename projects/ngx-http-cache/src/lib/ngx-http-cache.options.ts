import { InjectionToken } from '@angular/core';

export const NGX_HTTP_CACHE_OPTIONS = new InjectionToken(
    'NGX_HTTP_CACHE_OPTIONS'
);

export enum NgxHttpCacheHeaders {
    Cache = 'ngx-http-cache',
    LocalStorage = 'ngx-http-cache-local-storage',
    Replace = 'ngx-http-cache-replace'
}

export enum NgxHttpCacheBehavior {
    PageLevel = 'PageLevel',
    All = 'All',
    None = 'None'
}

export interface NgxHttpCacheOptions {
    behavior?: NgxHttpCacheBehavior;
    localStorage?: boolean;
    methods?: string[];
}

export const DEFAULT_OPTIONS: NgxHttpCacheOptions = {
    behavior: NgxHttpCacheBehavior.All,
    localStorage: false,
    methods: ['GET']
};
