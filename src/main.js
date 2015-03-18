(function(window, CONTENT_TYPE) {
    "use strict"; /* es6-transpiler has-iterators:false, has-generators: false */

    var Promise = window.Promise,
        toString = Object.prototype.toString,
        isSimpleObject = (o) => toString.call(o) === "[object Object]";

    function XHR(method, url, config = {}) {
        method = method.toUpperCase();

        var headers = config.headers || {},
            contentType = headers[CONTENT_TYPE],
            charset = "charset" in config ? config.charset : XHR.defaults.charset,
            cacheBurst = "cacheBurst" in config ? config.cacheBurst : XHR.defaults.cacheBurst,
            data = config.data;

        if (isSimpleObject(data)) {
            data = Object.keys(data).reduce((memo, key) => {
                var name = encodeURIComponent(key),
                    value = data[key];

                if (Array.isArray(value)) {
                    value.forEach((value) => {
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
        var promise = new Promise((resolve, reject) => {
                var handleErrorResponse = () => () => reject(xhr);

                xhr.onabort = handleErrorResponse();
                xhr.onerror = handleErrorResponse();
                xhr.ontimeout = handleErrorResponse();
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4) {
                        var status = xhr.status,
                            response = xhr.responseText,
                            contentType = xhr.getResponseHeader("Content-Type");

                        // parse response depending on Content-Type
                        if (contentType === "application/json") {
                            try {
                                response = JSON.parse(response);
                            } catch (err) {
                                return reject(err);
                            }
                        }

                        if (status >= 200 && status < 300 || status === 304) {
                            resolve(response);
                        } else {
                            reject(xhr);
                        }
                    }
                };

                xhr.open(method, url, true);
                xhr.timeout = config.timeout || XHR.defaults.timeout;

                Object.keys(XHR.defaults.headers).forEach((key) => {
                    if (!(key in headers)) {
                        headers[key] = XHR.defaults.headers[key];
                    }
                });

                Object.keys(headers).forEach((key) => {
                    var headerValue = headers[key];

                    if (headerValue != null) {
                        xhr.setRequestHeader(key, String(headerValue));
                    }
                });

                xhr.send(data);
            });

        promise[0] = xhr;

        return promise;
    }

    // define shortcuts
    ["get", "post", "put", "delete", "patch"].forEach((method) => {
        XHR[method] = (url, config) => XHR(method, url, config);
    });

    XHR.serialize = (elements) => {
        var result = {};

        if ("form" in elements) {
            elements = [elements];
        } else if ("elements" in elements) {
            elements = elements.elements;
        } else {
            elements = [];
        }

        for (let el of elements) {
            var name = el.name;

            if (el.disabled || !name) continue;

            switch(el.type) {
            case "select-multiple":
                result[name] = [];
                /* falls through */
            case "select-one":
                for (let option of el.options) {
                    if (option.selected) {
                        if (name in result) {
                            result[name].push(option.value);
                        } else {
                            result[name] = option.value;
                        }
                    }
                }
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
        }

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
