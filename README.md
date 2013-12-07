better-xhr [![Build Status](https://api.travis-ci.org/chemerisuk/better-xhr.png?branch=master)](http://travis-ci.org/chemerisuk/better-xhr)
=========================
> Better abstraction for XMLHttpRequest

## API
There are 3 possible ways to create a XHR instance(s):

* `XHR(method, url, data)` - simple form that is useful for most of cases, `data` argument is optional
* `XHR(settings)` - more advanced configuration that allows to use all possible options
* `XHR([method, url, data], settings1, ...)` - multi XHR instance

### Settings
* **method** - type of ajax request (`"get"`, `"post"`, `"put"` etc.)
* **url** - target URL
* **data** - data that should be sent in request body
* **headers** - extra headers that should be added to request (could be a function that returns key/value object)
* **timeout** - request timeout value in miliseconds
* **withCredentials** - value of the `withCredentials` flag
* **responseType** - value of the `responseType` property (`"text"`, `"arraybuffer"`, `"blob"`, or `"document"`)

### Methods
Every XHR instance has `then` method that accepts parameters declared in the [Promises/A](http://wiki.commonjs.org/wiki/Promises/A) spec:

    then(fulfilledHandler, errorHandler, progressHandler)

To break request(s) `abort` method could be used.

### Global overrides
The **XHR** function has static properties that could be used to define default values for appropriare settings. For instance:

* `XHR.headers` - key/value map of request headers that should be added into each request
* `XHR.timeout` - default timeout value in miliseconds
* `XHR.withCredentials` - default value of withCredentials
* etc.

Additionally the function has extra properties to specify global callbacks:

* `XHR.onload` - global callback that executes on every successfull request
* `XHR.onerror` - global callback that executes on every errored request
* `XHR.onprogress` - global callback that executes on every request that is in progress

## Browser support
* Chrome
* Safari 6.0+
* Firefox 16+
* Opera 12.10+
* IE8+
