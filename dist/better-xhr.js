/**
 * better-xhr: Better abstraction for XMLHttpRequest
 * @version 0.4.4 Wed, 25 Mar 2015 09:25:20 GMT
 * @link https://github.com/chemerisuk/better-xhr
 * @copyright 2015 Maksim Chemerisuk
 * @license MIT
 */
(function(window, CONTENT_TYPE, MIME_JSON, HTTP_METHODS) {
    "use strict"; /* es6-transpiler has-iterators:false, has-generators: false */

    var Promise = window.Promise,
        toString = Object.prototype.toString,
        isSimpleObject = function(o)  {return toString.call(o) === "[object Object]"},
        toQueryString = function(params)  {return params.join("&").replace(/%20/g, "+")},
        mimeTypeShortcuts = {
            json: MIME_JSON
        },
        mimeTypeStrategies = {};

    mimeTypeStrategies[MIME_JSON] = function(text)  {return JSON.parse(text)};

    function XHR(method, url) {var config = arguments[2];if(config === void 0)config = {};
        method = method.toUpperCase();

        var charset = "charset" in config ? config.charset : XHR.defaults.charset,
            cacheBurst = "cacheBurst" in config ? config.cacheBurst : XHR.defaults.cacheBurst,
            mimeType = "mimeType" in config ? config.mimeType : XHR.defaults.mimeType,
            data = config.data,
            extraArgs = [],
            headers = {};

        // read default headers first
        Object.keys(XHR.defaults.headers).forEach(function(key)  {
            headers[key] = XHR.defaults.headers[key];
        });

        // apply request specific headers
        Object.keys(config.headers || {}).forEach(function(key)  {
            headers[key] = config.headers[key];
        });

        if (isSimpleObject(data)) {
            Object.keys(data).forEach(function(key)  {
                var name = encodeURIComponent(key),
                    value = data[key];

                if (Array.isArray(value)) {
                    value.forEach(function(value)  {
                        extraArgs.push(name + "=" + encodeURIComponent(value));
                    });
                } else {
                    extraArgs.push(name + "=" + encodeURIComponent(value));
                }
            });

            if (method === "GET") {
                data = null;
            } else {
                data = toQueryString(extraArgs);
                extraArgs = [];
            }
        }

        if (typeof data === "string") {
            if (method === "GET") {
                extraArgs.push(data);

                data = null;
            } else {
                headers[CONTENT_TYPE] = "application/x-www-form-urlencoded";
            }
        }

        if (isSimpleObject(config.json)) {
            data = JSON.stringify(config.json);

            headers[CONTENT_TYPE] = MIME_JSON;
        }

        if (CONTENT_TYPE in headers) {
            headers[CONTENT_TYPE] += "; charset=" + charset;
        }

        if (cacheBurst && method === "GET") {
            extraArgs.push(cacheBurst + "=" + Date.now());
        }

        if (config.emulateHTTP && HTTP_METHODS.indexOf(method) > 1) {
            extraArgs.push(config.emulateHTTP + "=" + method);
            headers["X-Http-Method-Override"] = method;
            method = "POST";
        }

        if (extraArgs.length) {
            url += (~url.indexOf("?") ? "&" : "?") + toQueryString(extraArgs);
        }

        var xhr = new XMLHttpRequest();
        var promise = new Promise(function(resolve, reject)  {
                var handleErrorResponse = function(message)  {return function()  { reject(new Error(message)) }};

                xhr.onabort = handleErrorResponse("abort");
                xhr.onerror = handleErrorResponse("error");
                xhr.ontimeout = handleErrorResponse("timeout");
                xhr.onreadystatechange = function()  {
                    if (xhr.readyState === 4) {
                        // by default parse response depending on Content-Type header
                        mimeType = mimeType || xhr.getResponseHeader(CONTENT_TYPE) || "";

                        var status = xhr.status,
                            response = xhr.responseText,
                            // skip possible charset suffix
                            parseResponse = mimeTypeStrategies[mimeType.split(";")[0]];

                        if (parseResponse) {
                            try {
                                // when strategy found - parse response according to it
                                response = parseResponse(response);
                            } catch (err) {
                                return reject(err);
                            }
                        }

                        if (status >= 200 && status < 300 || status === 304) {
                            resolve(response);
                        } else {
                            reject(response);
                        }
                    }
                };

                xhr.open(method, url, true);
                xhr.timeout = config.timeout || XHR.defaults.timeout;
                // set request headers
                Object.keys(headers).forEach(function(key)  {
                    var headerValue = headers[key];

                    if (headerValue != null) {
                        xhr.setRequestHeader(key, String(headerValue));
                    }
                });

                if (mimeType) {
                    if (mimeType in mimeTypeShortcuts) {
                        xhr.responseType = mimeType;
                        mimeType = mimeTypeShortcuts[mimeType];
                    } else if (xhr.overrideMimeType) {
                        xhr.overrideMimeType(mimeType);
                    }
                }

                xhr.send(data);
            });

        promise[0] = xhr;

        return promise;
    }

    // define shortcuts
    HTTP_METHODS.forEach(function(method)  {
        XHR[method.toLowerCase()] = function(url, config)  {return XHR(method, url, config)};
    });

    XHR.serialize = function(node)  {var $D$0;var $D$1;var $D$2;var $D$3;var $D$4;
        var result = {};

        if ("form" in node) {
            node = [node];
        } else if ("elements" in node) {
            node = node.elements;
        } else {
            node = [];
        }

        $D$0 = 0;$D$1 = node.length;for (var el ;$D$0 < $D$1;){el = (node[$D$0++]);
            var name = el.name;

            if (el.disabled || !name) continue;

            switch(el.type) {
            case "select-multiple":
                result[name] = [];
                /* falls through */
            case "select-one":
                $D$4 = (el.options);$D$2 = 0;$D$3 = $D$4.length;for (var option ;$D$2 < $D$3;){option = ($D$4[$D$2++]);
                    if (option.selected) {
                        if (name in result) {
                            result[name].push(option.value);
                        } else {
                            result[name] = option.value;
                        }
                    }
                };$D$2 = $D$3 = $D$4 = void 0;
                break;

            case undefined:
            case "fieldset": // fieldset
            case "file": // file input
            case "submit": // submit button
            case "reset": // reset button
            case "button": // custom button
                break;

            case "checkbox": // checkbox
                if (el.checked && result[name]) {
                    if (typeof result[name] === "string") {
                        result[name] = [ result[name] ];
                    }

                    result[name].push(el.value);

                    break;
                }
                /* falls through */
            case "radio": // radio button
                if (!el.checked) break;
                /* falls through */
            default:
                result[name] = el.value;
            }
        };$D$0 = $D$1 = void 0;

        return result;
    };

    // useful defaults
    XHR.defaults = {
        timeout: 15000,
        cacheBurst: "_",
        charset: "UTF-8",
        headers: { "X-Requested-With": "XMLHttpRequest" }
    };

    if (Promise) {
        // expose namespace globally
        window.XHR = XHR;
    } else {
        throw new Error("In order to use XHR you have to include a Promise polyfill");
    }
})(window, "Content-Type", "application/json", ["GET", "POST", "PUT", "DELETE", "PATCH"]);
