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
| `data`   | `Object` or `String`| Specifies data that you want to send in AJAX request.<br><br>An object value is serialized via query string algorithm.<br><br><ul><li>for `GET` requests `data` argument is appended directly to URL</li><li>otherwise is will be passed into the `XMLHttpRequest#send` call and `"Content-Type"` will be `"application/x-www-form-urlencoded"`</li> 
| `json`   | `Object` or `String` | Specifies JSON data for AJAX request.<br><br>An object value is serialized via `JSON.stringify`. <br><br>Adds `"Content-Type"` header with value `"application/json; charset=UTF-8"`
| `cacheBurst` | `String` | Cache bursting parameter. Allows to specify name of the extra dummy argument that disables caching.<br><br>By default it's `"_"`
| `timeout` | `Number` | The argument specifies request timeout in miliseconds.<br><br> Default value is `15000`

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
