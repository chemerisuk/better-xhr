better-xhr [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url]
=========================
> Better abstraction for XMLHttpRequest

__Alpha status - still in development.__

## API

```js
XHR(method, url, config).then(...)
// or shortcuts
XHR.get(url, config).then(...);
XHR.post(url, config).then(...);
```

Global `XHR` function returns `Promise` object. Promise implementation depends on the [promise-polyfill](https://github.com/taylorhakes/promise-polyfill) project.

## AJAX configuration

Configuration of the `XHR` i inspired by excellent [request](https://github.com/mikeal/request) project. Basically it uses a plain object to specify any kind of metadata for the `XMLHttpRequest`.

| Property | Type    | Description |
| -------- | ------- | ----------- | 
| `headers` | `Object` | Specifies extra HTTP headers for request. You can drop any default header via setting it to `null`
| `data`   | `Object` or `String`| Specifies data that you want to send in AJAX request. Object is serialized via query string algorithm. <ul><li>for `GET` requests `data` argument is appended directly to URL</li><li>otherwise is will be passed into the `XMLHttpRequest#send` call and `"Content-Type"` will be `"application/x-www-form-urlencoded"`</li> 
| `json`   | `Object` | Specifies JSON data for AJAX request. The object will be serialized via `JSON.stringify` call and request will have `"Content-Type"` to be `"application/json; charset=UTF-8"` 

## Browser support
#### Desktop
* Chrome
* Safari 6.0+
* Firefox 16+
* Opera 12.10+
* IE8+

#### Mobile
* iOS Safari 6+
* Android 2.3+
* Chrome for Android

[travis-url]: http://travis-ci.org/chemerisuk/better-xhr
[travis-image]: http://img.shields.io/travis/chemerisuk/better-xhr/master.svg

[coveralls-url]: https://coveralls.io/r/chemerisuk/better-xhr
[coveralls-image]: http://img.shields.io/coveralls/chemerisuk/better-xhr/master.svg
