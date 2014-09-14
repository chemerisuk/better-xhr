better-xhr [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url]
=========================
> Better abstraction for XMLHttpRequest

__Alpha status - still in development.__

## API

    XHR(method, url, config).then(...)
    // or shortcuts
    XHR.get(url, config).then(...);
    XHR.post(url, config).then(...);

Global `XHR` function returns `Promise` object.

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
[travis-image]: https://api.travis-ci.org/chemerisuk/better-xhr.png?branch=master

[coveralls-url]: https://coveralls.io/r/chemerisuk/better-xhr
[coveralls-image]: https://coveralls.io/repos/chemerisuk/better-xhr/badge.png?branch=master
