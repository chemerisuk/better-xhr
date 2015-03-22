(function(window, CONTENT_TYPE, MIME_JSON, HTTP_METHODS) {
    "use strict"; /* es6-transpiler has-iterators:false, has-generators: false */

    var Promise = window.Promise,
        toString = Object.prototype.toString,
        isSimpleObject = (o) => toString.call(o) === "[object Object]",
        toQueryString = (params) => params.join("&").replace(/%20/g, "+"),
        mimeTypeShortcuts = {
            json: MIME_JSON
        },
        mimeTypeStrategies = {};

    mimeTypeStrategies[MIME_JSON] = (text) => JSON.parse(text);

    function XHR(method, url, config = {}) {
        method = method.toUpperCase();

        var charset = "charset" in config ? config.charset : XHR.defaults.charset,
            cacheBurst = "cacheBurst" in config ? config.cacheBurst : XHR.defaults.cacheBurst,
            mimeType = "mimeType" in config ? config.mimeType : XHR.defaults.mimeType,
            data = config.data,
            extraArgs = [],
            headers = {};

        // read default headers first
        Object.keys(XHR.defaults.headers).forEach((key) => {
            headers[key] = XHR.defaults.headers[key];
        });

        // apply request specific headers
        Object.keys(config.headers || {}).forEach((key) => {
            headers[key] = config.headers[key];
        });

        if (isSimpleObject(data)) {
            Object.keys(data).forEach((key) => {
                var name = encodeURIComponent(key),
                    value = data[key];

                if (Array.isArray(value)) {
                    value.forEach((value) => {
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
        var promise = new Promise((resolve, reject) => {
                var handleErrorResponse = (message) => () => { reject(new Error(message)) };

                xhr.onabort = handleErrorResponse("abort");
                xhr.onerror = handleErrorResponse("error");
                xhr.ontimeout = handleErrorResponse("timeout");
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4) {
                        var status = xhr.status,
                            response = xhr.responseText;
                        // by default parse response depending on Content-Type header
                        mimeType = mimeType || xhr.getResponseHeader(CONTENT_TYPE);
                        // skip possible charset suffix
                        var parseResponse = mimeTypeStrategies[mimeType.split(";")[0]];

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
                Object.keys(headers).forEach((key) => {
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
    HTTP_METHODS.forEach((method) => {
        XHR[method.toLowerCase()] = (url, config) => XHR(method, url, config);
    });

    XHR.serialize = (node) => {
        var result = {};

        if ("form" in node) {
            node = [node];
        } else if ("elements" in node) {
            node = node.elements;
        } else {
            node = [];
        }

        for (let el of node) {
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
})(window, "Content-Type", "application/json", ["GET", "POST", "PUT", "DELETE", "PATCH"]);
