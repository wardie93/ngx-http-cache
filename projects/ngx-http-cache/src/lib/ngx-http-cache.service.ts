import { HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxHttpCacheBehavior } from './ngx-http-cache.options';

@Injectable({
    providedIn: 'root'
})
export class NgxHttpCacheService {
    private cache: {
        key: string;
        behavior: NgxHttpCacheBehavior;
        value: string;
    }[] = [];
    private keyPrefix = 'ngx-http-cache';

    constructor() { }

    private getExistingIndex(
        key: string | undefined,
        behavior: NgxHttpCacheBehavior
    ): number {
        if (key == undefined) {
            return -1;
        }

        const index = this.cache.findIndex(
            c =>
                c.key.toLowerCase() === key!.toLowerCase() &&
                c.behavior === behavior
        );

        return index;
    }

    private getKey(
        key: string | undefined,
        behavior: NgxHttpCacheBehavior
    ): string | undefined {
        if (key == undefined) {
            return undefined;
        }

        const prefix = `${this.keyPrefix}-${behavior}`;

        if (key!.startsWith(prefix)) {
            return key;
        }

        return `${prefix}-${key}`;
    }

    set(
        key: string,
        value: string,
        behavior: NgxHttpCacheBehavior,
        localStorage: boolean
    ): void {
        const transformedKey = this.getKey(key, behavior);

        if (transformedKey == undefined) {
            return;
        }

        if (!localStorage) {
            const existingIndex = this.getExistingIndex(
                transformedKey,
                behavior
            );

            const object = {
                key: transformedKey!,
                value: value,
                behavior: behavior
            };

            if (existingIndex !== -1) {
                this.cache[existingIndex] = object;
            } else {
                this.cache.push(object);
            }
        } else {
        }
    }

    get(
        key: string,
        behavior: NgxHttpCacheBehavior,
        localStorage: boolean
    ): string | undefined {
        const transformedKey = this.getKey(key, behavior);

        if (transformedKey == undefined) {
            return undefined;
        }

        if (!localStorage) {
            const existingIndex = this.getExistingIndex(
                transformedKey,
                behavior
            );

            if (existingIndex !== -1) {
                return this.cache[existingIndex].value;
            }

            return undefined;
        }

        return '';
    }

    clear(behavior: NgxHttpCacheBehavior): void {
        const indicesToRemove: number[] = [];

        this.cache.forEach((entry, index) => {
            if (entry.behavior === behavior) {
                indicesToRemove.push(index);
            }
        });

        indicesToRemove.forEach(i => {
            this.cache.splice(i, 1);
        });

    }

    createKey(request: HttpRequest<unknown>): string {
        const body = JSON.stringify(request.body);
        const key = `${request.method}.${request.urlWithParams}.${body}`;
        return key;
    }
}
