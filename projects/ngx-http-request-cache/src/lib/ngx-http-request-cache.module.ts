import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Provider } from '@angular/core';

import {
    NgxHttpRequestInterceptor,
} from './ngx-http-request-cache.interceptor';
import {
    DEFAULT_OPTIONS,
    NGX_HTTP_CACHE_OPTIONS,
    NgxHttpRequestOptions,
} from './ngx-http-request-cache.options';

export interface NgxHttpRequestProviderOptions {
    provider?: Provider;
    config?: NgxHttpRequestOptions;
}

@NgModule({
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: NgxHttpRequestInterceptor,
            multi: true
        }
    ]
})
export class NgxHttpRequestModule {
    static forRoot(
        options?: NgxHttpRequestProviderOptions
    ): ModuleWithProviders<NgxHttpRequestModule> {
        return {
            ngModule: NgxHttpRequestModule,
            providers: [
                options?.provider || {
                    provide: NGX_HTTP_CACHE_OPTIONS,
                    useValue: setDefaultOptions(options?.config)
                }
            ]
        };
    }
}

function setDefaultOptions(options?: NgxHttpRequestOptions): NgxHttpRequestOptions {
    const defaultOptions = DEFAULT_OPTIONS;
    return {
        behavior: options?.behavior ?? defaultOptions.behavior,
        localStorage: options?.localStorage ?? defaultOptions.localStorage,
        methods: options?.methods ?? defaultOptions.methods
    };
}
