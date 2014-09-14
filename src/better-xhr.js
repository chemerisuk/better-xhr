(function(global) {
    var XHR = function(method, url, config) {
        config = config || {};

        var headers = config.headers || {},
            data = config.data;

        if (Object.prototype.toString.call(config.json) === "[object Object]") {
            data = JSON.stringify(config.json);

            headers["Content-Type"] = "application/json; charset=UTF-8";
        }

        if (Object.prototype.toString.call(config.query) === "[object Object]") {
            data = Object.keys(config.query).reduce(function(memo, key) {
                var name = encodeURIComponent(key),
                    value = config.query[key];

                if (Array.isArray(value)) {
                    value.forEach(function(value) {
                        memo.push(name + "=" + encodeURIComponent(value));
                    });
                } else {
                    memo.push(name + "=" + encodeURIComponent(value));
                }

                return memo;
            }, []).join("&").replace(/%20/g, "+");

            if (method === "get") {
                url += (~url.indexOf("?") ? "&" : "?") + data;

                data = null;
            } else {
                headers["Content-Type"] = "application/x-www-form-urlencoded";
            }
        }

        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();

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

            xhr.open(method.toUpperCase(), url, true);

            if (!("X-Requested-With" in headers)) {
                headers["X-Requested-With"] = "XMLHttpRequest";
            }

            Object.keys(headers).forEach(function(key) {
                if (headers[key]) xhr.setRequestHeader(key, headers[key]);
            });

            xhr.send(data);
        });
    },
    Promise;

    XHR.get = function(url, config) {
        return XHR("get", url, config);
    };

    XHR.post = function(url, config) {
        return XHR("post", url, config);
    };

    if (typeof module !== "undefined" && module.exports) {
        Promise = require("promise-polyfill");

        module.exports = XHR;
    } else {
        Promise = global.Promise;

        global.XHR = XHR;
    }
})(this);
