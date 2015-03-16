/**
 * better-xhr: Better abstraction for XMLHttpRequest
 * @version 0.4.0 Mon, 16 Mar 2015 10:02:52 GMT
 * @link 
 * @copyright 2014 Maksim Chemerisuk
 * @license MIT
 */
(function(window, CONTENT_TYPE) {
    "use strict"; /* es6-transpiler has-iterators:false, has-generators: false */

    var Promise = window.Promise,
        toString = Object.prototype.toString,
        isSimpleObject = function(o)  {return toString.call(o) === "[object Object]"};

    function XHR(method, url) {var config = arguments[2];if(config === void 0)config = {};
        method = method.toUpperCase();

        var headers = config.headers || {},
            contentType = headers[CONTENT_TYPE],
            charset = "charset" in config ? config.charset : XHR.defaults.charset,
            cacheBurst = "cacheBurst" in config ? config.cacheBurst : XHR.defaults.cacheBurst,
            data = config.data;

        if (isSimpleObject(data)) {
            data = Object.keys(data).reduce(function(memo, key)  {
                var name = encodeURIComponent(key),
                    value = data[key];

                if (Array.isArray(value)) {
                    value.forEach(function(value)  {
                        memo.push(name + "=" + encodeURIComponent(value));
                    });
                } else {
                    memo.push(name + "=" + encodeURIComponent(value));
                }

                return memo;
            }, []).join("&").replace(/%20/g, "+");
        }

        if (typeof data === "string") {
            if (method === "GET") {
                url += (~url.indexOf("?") ? "&" : "?") + data;

                data = null;
            } else {
                contentType = contentType || "application/x-www-form-urlencoded";
            }
        }

        if (isSimpleObject(config.json)) {
            data = JSON.stringify(config.json);

            contentType = contentType || "application/json";
        }

        if (contentType) {
            if (charset) contentType += "; charset=" + charset;

            headers[CONTENT_TYPE] = contentType;
        }

        if (cacheBurst && method === "GET") {
            url += (~url.indexOf("?") ? "&" : "?") + cacheBurst + "=" + Date.now();
        }

        var xhr = new XMLHttpRequest();
        var promise = new Promise(function(resolve, reject)  {
                xhr.onabort = function()  { reject(Error("abort")) };
                xhr.onerror = function()  { reject(Error("fail")) };
                xhr.ontimeout = function()  { reject(Error("timeout")) };
                xhr.onreadystatechange = function()  {
                    if (xhr.readyState === 4) {
                        var status = xhr.status;

                        data = xhr.responseText;

                        try {
                            data = JSON.parse(data);
                        } catch (err) {}

                        if (status >= 200 && status < 300 || status === 304) {
                            resolve(data);
                        } else {
                            reject(data);
                        }
                    }
                };

                xhr.open(method, url, true);
                xhr.timeout = config.timeout || XHR.defaults.timeout;

                Object.keys(XHR.defaults.headers).forEach(function(key)  {
                    if (!(key in headers)) {
                        headers[key] = XHR.defaults.headers[key];
                    }
                });

                Object.keys(headers).forEach(function(key)  {
                    xhr.setRequestHeader(key, String(headers[key]));
                });

                xhr.send(data);
            });

        promise[0] = xhr;

        return promise;
    }

    // define shortcuts
    ["get", "post", "put", "delete", "patch"].forEach(function(method)  {
        XHR[method] = function(url, config)  {return XHR(method, url, config)};
    });

    XHR.serialize = function(elements)  {var $D$0;var $D$1;var $D$2;var $D$3;var $D$4;
        var result = {};

        if ("form" in elements) {
            elements = [elements];
        } else if ("elements" in elements) {
            elements = elements.elements;
        } else {
            elements = [];
        }

        $D$0 = 0;$D$1 = elements.length;for (var el ;$D$0 < $D$1;){el = (elements[$D$0++]);
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

            case "radio": // radio button
            case "checkbox": // checkbox
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
})(window, "Content-Type");
