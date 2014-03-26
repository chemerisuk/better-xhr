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
            "src/*.js",
            "test/spec/*.spec.js"
        ]
    });
};
