import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Provider } from '@angular/core';

import { NgxHttpCacheInterceptor } from './ngx-http-cache.interceptor';
import {
    DEFAULT_OPTIONS,
    NGX_HTTP_CACHE_OPTIONS,
    NgxHttpCacheOptions,
} from './ngx-http-cache.options';

export interface NgxHttpCacheProviderOptions {
    provider?: Provider;
    config?: NgxHttpCacheOptions;
}

@NgModule({
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: NgxHttpCacheInterceptor,
            multi: true
        }
    ]
})
export class NgxHttpCacheModule {
    static forRoot(
        options?: NgxHttpCacheProviderOptions
    ): ModuleWithProviders<NgxHttpCacheModule> {
        return {
            ngModule: NgxHttpCacheModule,
            providers: [
                options?.provider || {
                    provide: NGX_HTTP_CACHE_OPTIONS,
                    useValue: setDefaultOptions(options?.config)
                }
            ]
        };
    }
}

function setDefaultOptions(options?: NgxHttpCacheOptions): NgxHttpCacheOptions {
    const defaultOptions = DEFAULT_OPTIONS;
    return {
        behavior: options?.behavior ?? defaultOptions.behavior,
        localStorage: options?.localStorage ?? defaultOptions.localStorage,
        methods: options?.methods ?? defaultOptions.methods
    };
}
