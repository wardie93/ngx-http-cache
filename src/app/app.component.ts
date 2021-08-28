import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import {
    NgxHttpRequestBehavior,
    NgxHttpRequestHeaders,
} from 'ngx-http-request-cache';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    results: any[] = [];
    behaviors: { value: string; display: string; }[] = [];
    replaceCache = false;
    behavior?: NgxHttpRequestBehavior;

    constructor(private readonly http: HttpClient) {
        this.behaviors.push({
            value: NgxHttpRequestBehavior.All,
            display: 'All'
        });
        this.behaviors.push({
            value: NgxHttpRequestBehavior.None,
            display: 'None'
        });
        this.behaviors.push({
            value: NgxHttpRequestBehavior.PageLevel,
            display: 'Page Level'
        });
    }

    loadingTest(): void {
        this.results = [];

        let headers = new HttpHeaders();

        if (this.replaceCache) {
            headers = headers.append(NgxHttpRequestHeaders.Replace, '');
        }

        if (this.behavior) {
            headers = headers.append(NgxHttpRequestHeaders.Cache, this.behavior!);
        }

        this.http
            .get<any[]>('http://localhost:3000/users', { headers: headers })
            .subscribe(response => {
                this.results = response;
            });
    }
}
