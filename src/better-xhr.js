(function(global) {
    "use strict";

    var toString = Object.prototype.toString,
        arrayToSettings = function(args) {
            return {
                method: args[0],
                url: args[1],
                data: args[2]
            };
        };

    function XHR(type) {
        if (this instanceof XHR) return this;

        var result = new XHR(), i = 0, n, settings;

        if (typeof type === "object") {
            for (n = arguments.length; i < n; ++i) {
                settings = arguments[i];

                if (toString.call(settings) === "[object Array]") {
                    settings = arrayToSettings(settings);
                }

                result[i] = settings;
            }
        } else {
            result[i++] = arrayToSettings(arguments);
        }

        result.length = i;

        return result;
    }

    XHR.prototype = {
        abort: function() {
            for (var i = 0, n = this.length; i < n; ++i) {
                if (this[i] instanceof XMLHttpRequest) {
                    this[i].abort();
                }
            }
        },
        then: function(fulfilledHandler, errorHandler, progressHandler) {
            var result = new XHR(),
                data, i, n, xhr, settings, prop, type,
                onerror = function() {
                    errorCallback(this);
                },
                onreadystatechange = function() {
                    if (this.readyState === 4) {
                        var status = this.status,
                            response = this.responseText;

                        try {
                            response = JSON.parse(response);
                        } catch (err) {
                            // response is a text content
                        } finally {
                            if (status >= 200 && status < 300 || status === 304) {
                                successCallback(response);
                            } else {
                                errorCallback(response);
                            }
                        }
                    } else {
                        if (progressHandler) progressHandler(this);
                    }
                },
                successCallback = function(response) {
                    if (--i === 0) fulfilledHandler(response);
                },
                errorCallback = function(response) {
                    if (errorHandler) errorHandler(response);
                };

            for (i = 0, n = this.length; i < n; ++i) {
                xhr = new XMLHttpRequest();
                settings = this[i];

                xhr.ontimeout = onerror;
                xhr.onerror = onerror;
                xhr.onreadystatechange = onreadystatechange;
                xhr.timeout = settings.timeout || XHR.timeout;

                xhr.open(settings.method.toUpperCase(), settings.url, !settings.sync);

                settings.headers = settings.headers || XHR.headers;

                for (prop in settings.headers) {
                    xhr.setRequestHeader(prop, settings.headers[prop]);
                }

                result[i] = xhr;

                data = settings.data;
                type = settings.headers["Content-Type"];

                if (!type) {
                    if (toString.call(settings.data) === "[object Object]") {
                        data = [];

                        for (prop in settings.data) {
                            data.push(encodeURIComponent(prop) + "=" + encodeURIComponent(settings.data[prop]));
                        }

                        data = data.join("&").replace(/%20/g, "+");
                    }

                    if (typeof data === "string") {
                        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                    }
                } else if (!type.indexOf("application/json")) {
                    if (toString.call(settings.data) === "[object Object]") {
                        data = JSON.stringify(data);
                    }
                }

                xhr.send(data);
            }

            result.length = this.length;

            return result;
        }
    };

    XHR.timeout = 15000;
    XHR.headers = {"X-Requested-With": "XMLHttpRequest"};
    XHR.withCredentials = false;

    global.XHR = XHR;
}(window || this));
