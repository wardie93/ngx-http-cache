import { InjectionToken } from '@angular/core';

export const NGX_HTTP_CACHE_OPTIONS = new InjectionToken(
    'NGX_HTTP_CACHE_OPTIONS'
);

export enum NgxHttpRequestHeaders {
    Cache = 'ngx-http-request-cache',
    LocalStorage = 'ngx-http-request-cache-local-storage',
    Replace = 'ngx-http-request-cache-replace'
}

export enum NgxHttpRequestBehavior {
    PageLevel = 'PageLevel',
    All = 'All',
    None = 'None'
}

export enum NgxHttpRequestMethod {
    Delete = 'DELETE',
    Get = 'GET',
    Head = 'HEAD',
    Jsonp = 'JSONP',
    Options = 'OPTIONS',
    Patch = 'PATCH',
    Post = 'POST',
    Put = 'PUT'
}

export interface NgxHttpRequestOptions {
    behavior?: NgxHttpRequestBehavior;
    localStorage?: boolean;
    methods?: NgxHttpRequestMethod[];
}

export const DEFAULT_OPTIONS: NgxHttpRequestOptions = {
    behavior: NgxHttpRequestBehavior.None,
    localStorage: false,
    methods: [NgxHttpRequestMethod.Get]
};
