# ngx-http-request-cache

Configurable caching of HTTP requests in Angular.

[![npm version](https://badge.fury.io/js/ngx-http-request-cache.svg)](https://badge.fury.io/js/ngx-http-request-cache)

## Table of contents

- [ngx-http-request-cache](#ngx-http-request-cache)
  - [Table of contents](#table-of-contents)
  - [Demo](#demo)
  - [Installation](#installation)
    - [NPM](#npm)
  - [Getting started](#getting-started)
    - [Options](#options)
      - [Behavior](#behavior)
  - [Customisation](#customisation)
  - [TODO](#todo)

## Demo

For a demo, download the repository, install NPM packages, then run the following commands:

```
npm run start:api
npm run watch:lib
npm start
```

The first command will start a fake API that is used to make HTTP calls to, the second will compile `ngx-http-request-cache`, the third command will open a demo site that shows this working.

## Installation
Install `ngx-http-request-cache` via NPM, using the command below.

### NPM
```shell
npm install --save ngx-http-request-cache
```

## Getting started
Import the `NgxHttpRequestModule` in your root application module:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxHttpRequestModule } from 'ngx-http-request-cache';

@NgModule({
  //...
  imports: [
    //...
    NgxHttpRequestModule.forRoot()
  ],
  //...
})
export class AppModule { }
```

You can either pass a personalised config into `forRoot` or leave the method call empty to use the defaults. Options listed below.

### Options

| Option         | Type                     | Options                                                                                                                                                                                                                         | Default                       | Use                                                                                                                                                                                                                                 |
| -------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `behavior`     | `NgxHttpRequestBehavior` | `[NgxHttpRequestBehavior.None, NgxHttpRequestBehavior.All, NgxHttpRequestBehavior.PageLevel]`                                                                                                                                   | `NgxHttpRequestBehavior.None` | Used to define the behavior that all HTTP requests should be sent with.                                                                                                                                                             |
| `localStorage` | `boolean`                |                                                                                                                                                                                                                                 | false                         | Whether or not to store the cached results in `localStorage`. If this is set then the results will only be stored until the application is reloaded, or the page is refreshed depending on the type of behavior chosen (see below). |
| `methods`      | `NgxHttpRequestMethod[]` | `[NgxHttpRequestMethod.Delete, NgxHttpRequestMethod.Get, NgxHttpRequestMethod.Head, NgxHttpRequestMethod.Jsonp, NgxHttpRequestMethod.Options, NgxHttpRequestMethod.Patch, NgxHttpRequestMethod.Post, NgxHttpRequestMethod.Put]` | `[NgxHttpRequestMethod.Get]`  | The HTTP request types that should have hte default behavior applied to them.                                                                                                                                                       |


#### Behavior

1. `None` - This means that no requests will be cached
2. `All` - This means that all requests will be cached
3. `PageLevel` - This means that all requests will be cached until the URL changes.

## Customisation

You can also customise the behavior per request.

```typescript

...

let headers = new HttpHeaders();

// Change the behavior for this request specifically
// Can choose from any of the available behaviors
headers = headers.append(NgxHttpRequestHeaders.Cache, NgxHttpRequestBehavior);

// State that the result for this particular should be stored in local storage
headers = headers.append(NgxHttpRequestHeaders.LocalStorage, 'true');

// If this header is provided then this means that any existing cached value will be replaced
headers = headers.append(NgxHttpRequestHeaders.Replace, '');

this.http.get<any[]>('http://localhost:3000/users', { headers: headers });

...

```

## TODO

1. Add timed caching
1. If cache exists for a lower/higher level make it configurable to use it.
