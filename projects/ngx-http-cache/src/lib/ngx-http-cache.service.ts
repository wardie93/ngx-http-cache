import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { NgxHttpCacheBehavior } from './ngx-http-cache.options';

@Injectable({
    providedIn: 'root'
})
export class NgxHttpCacheService {
    private cache: CachedResponse[] = [];
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

    private getPrefix(behavior: NgxHttpCacheBehavior): string {
        const prefix = `${this.keyPrefix}-${behavior}`;
        return prefix;
    }

    private getKey(
        key: string | undefined,
        behavior: NgxHttpCacheBehavior
    ): string | undefined {
        if (key == undefined) {
            return undefined;
        }

        const prefix = this.getPrefix(behavior);

        if (key!.startsWith(prefix)) {
            return key;
        }

        return `${prefix}-${key}`;
    }

    set(
        key: string,
        value: HttpResponse<unknown>,
        behavior: NgxHttpCacheBehavior,
        useLocalStorage: boolean
    ): void {
        const transformedKey = this.getKey(key, behavior);

        if (transformedKey == undefined) {
            return;
        }

        const object: CachedResponse = {
            key: transformedKey!,
            value: JSON.stringify(value),
            behavior: behavior
        };

        if (!useLocalStorage) {
            const existingIndex = this.getExistingIndex(
                transformedKey,
                behavior
            );

            if (existingIndex !== -1) {
                this.cache[existingIndex] = object;
            } else {
                this.cache.push(object);
            }
        } else {
            localStorage.setItem(transformedKey, JSON.stringify(object));
        }
    }

    get(
        key: string,
        behavior: NgxHttpCacheBehavior,
        useLocalStorage: boolean
    ): Object | undefined {
        const transformedKey = this.getKey(key, behavior);

        if (transformedKey == undefined) {
            return undefined;
        }

        let value: string;

        if (!useLocalStorage) {
            const existingIndex = this.getExistingIndex(
                transformedKey,
                behavior
            );

            if (existingIndex === -1) {
                return undefined;
            }

            value = this.cache[existingIndex].value;
        } else {
            const localStorageStringResult =
                localStorage.getItem(transformedKey);

            if (localStorageStringResult == undefined) {
                return undefined;
            }

            const localStorageResult: CachedResponse = JSON.parse(
                localStorageStringResult
            );

            value = localStorageResult?.value;
        }

        if (value == undefined) {
            return undefined;
        }

        return JSON.parse(value);
    }

    clear(behavior?: NgxHttpCacheBehavior): void {
        const indicesToRemove: number[] = [];

        this.cache.forEach((entry, index) => {
            if (behavior == undefined || entry.behavior === behavior) {
                indicesToRemove.push(index);
            }
        });

        indicesToRemove.forEach(i => {
            this.cache.splice(i, 1);
        });

        const localStorageKeysToRemove: string[] = [];

        Object.keys(localStorage).forEach(key => {
            if (behavior == undefined) {
                localStorageKeysToRemove.push(key);
                return;
            }

            const value = localStorage.getItem(key);
            const parsedValue: CachedResponse = JSON.parse(value!);

            if (parsedValue && parsedValue.behavior === behavior) {
                localStorageKeysToRemove.push(key);
            }
        });

        localStorageKeysToRemove.forEach(key => {
            localStorage.removeItem(key);
        });
    }

    createKey(request: HttpRequest<unknown>): string {
        const body = JSON.stringify(request.body);
        const key = `${request.method}.${request.urlWithParams}.${body}`;
        return key;
    }
}

class CachedResponse {
    key!: string;
    value!: string;
    behavior!: NgxHttpCacheBehavior;
}
