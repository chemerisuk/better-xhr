module.exports = function(config) {
    "use strict";

    config.set({
        basePath: "..",
        frameworks: ["jasmine"],
        browsers: ["PhantomJS"],
        preprocessors: { "src/better-xhr.js": "coverage" },
        coverageReporter: {
            type: "html",
            dir: "coverage/"
        },
        files: [
            "node_modules/jasmine-ajax/lib/mock-ajax.js",
            "node_modules/promise-polyfill/Promise.js",
            "src/*.js",
            "test/spec/*.spec.js"
        ]
    });
};
