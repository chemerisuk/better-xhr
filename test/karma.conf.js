module.exports = function(config) {
    "use strict";

    config.set({
        basePath: "..",
        frameworks: ["jasmine-ajax", "jasmine"],
        browsers: ["PhantomJS"],
        preprocessors: { "src/better-xhr.js": "coverage" },
        coverageReporter: {
            type: "html",
            dir: "coverage/"
        },
        files: [
            "bower_components/promise-polyfill/Promise.js",
            "src/*.js",
            "test/spec/*.spec.js"
        ]
    });
};
