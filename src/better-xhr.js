(function(global) {
    function XHR(type, url, data) {
        if (this instanceof XHR) return this;

        var result = new XHR(), i, n;

        if (typeof type === "object") {
            for (i = 0, n = arguments.length; i < n; ++i) {
                result[i] = arguments[i];
            }

            result.length = n;
        } else {
            result[0] = {
                type: type,
                url: url,
                data: data
            };

            result.length = 1;
        }

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
            var result = new XHR(), i, n, xhr, settings, prop,
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

                xhr.open(settings.type.toUpperCase(), settings.url, !settings.sync);

                settings.headers = settings.headers || XHR.headers;

                for (prop in settings.headers) {
                    xhr.setRequestHeader(prop, settings.headers[prop]);
                }

                result[i] = xhr;

                xhr.send(null);
            }

            result.length = this.length;

            return result;
        }
    };

    global.XHR = XHR;
}(this));
