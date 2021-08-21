import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { NgxHttpCacheInterceptor } from './ngx-http-cache.interceptor';
import {
    DEFAULT_OPTIONS,
    NgxHttpCacheOptions,
    NGX_OBSERVABLE_CACHE_OPTIONS
} from './ngx-http-cache.options';

export interface ObservableCacheProviderOptions {
    provider?: Provider;
    config?: NgxHttpCacheOptions;
}

@NgModule({
    declarations: [],
    imports: [],
    exports: [],
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
        options?: ObservableCacheProviderOptions
    ): ModuleWithProviders<NgxHttpCacheModule> {
        return {
            ngModule: NgxHttpCacheModule,
            providers: [
                options?.provider || {
                    provide: NGX_OBSERVABLE_CACHE_OPTIONS,
                    useValue: setDefaultOptions(options?.config)
                }
            ]
        };
    }
}

function setDefaultOptions(
    options?: NgxHttpCacheOptions
): NgxHttpCacheOptions {
    const defaultOptions = DEFAULT_OPTIONS;
    return {
        behavior: options?.behavior || defaultOptions.behavior,
    };
}
