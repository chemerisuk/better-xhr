module.exports = function(config) {
    "use strict";

    config.set({
        basePath: "..",
        frameworks: ["jasmine"],
        browsers: ["PhantomJS"],
        files: [
            "src/*.js",
            "test/spec/*.spec.js"
        ]
    });
};
