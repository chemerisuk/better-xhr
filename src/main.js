/* globals module, require */

(function() {
    "use strict";

    var global = this || window,
        toString = Object.prototype.toString,
        Promise;

    function XHR(method, url, config) {
        config = config || {};
        method = method.toUpperCase();

        var headers = config.headers || {},
            charset = "charset" in config ? config.charset : XHR.defaults.charset,
            cacheBurst = "cacheBurst" in config ? config.cacheBurst : XHR.defaults.cacheBurst,
            data = config.data;

        if (toString.call(data) === "[object Object]") {
            data = Object.keys(data).reduce(function(memo, key) {
                var name = encodeURIComponent(key),
                    value = data[key];

                if (Array.isArray(value)) {
                    value.forEach(function(value) {
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
                headers["Content-Type"] = "application/x-www-form-urlencoded; charset=" + charset;
            }
        }

        if (toString.call(config.json) === "[object Object]") {
            data = JSON.stringify(config.json);

            headers["Content-Type"] = "application/json; charset=" + charset;
        }

        if (cacheBurst && method === "GET") {
            url += (~url.indexOf("?") ? "&" : "?") + cacheBurst + "=" + Date.now();
        }

        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();

            xhr.onabort = function() { reject(new Error("abort")) };
            xhr.onerror = function() { reject(new Error("fail")) };
            xhr.ontimeout = function() { reject(new Error("timeout")) };
            xhr.onreadystatechange = function() {
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

            Object.keys(XHR.defaults.headers).forEach(function(key) {
                if (!(key in headers)) {
                    headers[key] = XHR.defaults.headers[key];
                }
            });

            Object.keys(headers).forEach(function(key) {
                if (headers[key]) {
                    xhr.setRequestHeader(key, headers[key]);
                }
            });

            xhr.send(data);
        });
    }

    XHR.get = function(url, config) {
        return XHR("get", url, config);
    };

    XHR.post = function(url, config) {
        return XHR("post", url, config);
    };

    XHR.serialize = (elements) => {
        var result = {};

        if ("form" in elements) {
            elements = [elements];
        } else if ("elements" in elements) {
            elements = elements.elements;
        } else {
            elements = [];
        }

        for (var i = 0, n = elements.length, el, name; i < n; ++i) {
            el = elements[i];
            name = el.name;

            if (el.disabled || !name) continue;

            switch(el.type) {
            case "select-multiple":
                result[name] = [];
                /* falls through */
            case "select-one":
                for (var options = el.options, j = 0, k = options.length, option; j < k; ++j) {
                    option = options[j];

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

    XHR.defaults = {
        timeout: 15000,
        cacheBurst: "_",
        charset: "UTF-8",
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
    };

    if (typeof module !== "undefined" && module.exports) {
        Promise = require("promise-polyfill");
    } else {
        Promise = global.Promise;
    }

    global.XHR = XHR;
})();
