import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgxHttpCacheBehavior, NgxHttpCacheHeaders } from 'ngx-http-cache';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    results: any[] = [];
    behaviors: { value: string; display: string; }[] = [];
    replaceCache = false;
    behavior?: NgxHttpCacheBehavior;

    constructor(private readonly http: HttpClient) {
        this.behaviors.push({
            value: NgxHttpCacheBehavior.All,
            display: 'All'
        });
        this.behaviors.push({
            value: NgxHttpCacheBehavior.None,
            display: 'None'
        });
        this.behaviors.push({
            value: NgxHttpCacheBehavior.PageLevel,
            display: 'Page Level'
        });
    }

    loadingTest(): void {
        this.results = [];

        let headers = new HttpHeaders();

        if (this.replaceCache) {
            headers = headers.append(NgxHttpCacheHeaders.Replace, '');
        }

        if (this.behavior) {
            headers = headers.append(NgxHttpCacheHeaders.Cache, this.behavior!);
        }

        this.http
            .get<any[]>('http://localhost:3000/users', { headers: headers })
            .subscribe(response => {
                this.results = response;
            });
    }
}
