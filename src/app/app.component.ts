import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    results: any[] = [];
    replaceCache = false;
    optOut = false;

    constructor(private readonly http: HttpClient) { }

    loadingTest(): void {
        this.results = [];

        this.http.get<any[]>('http://localhost:3000/users').subscribe(response => {
            this.results = response;
        });
    }

}
