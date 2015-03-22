/* globals XHR */

describe("XHR mimeType", function() {
    "use strict";

    beforeEach(function() {
        this.randomUrl = String(Date.now());
        this.spy = jasmine.createSpy("callback");

        jasmine.Ajax.install();
    });

    afterEach(function() {
        jasmine.Ajax.uninstall();

        this.mockXhr = null;
    });

    it("allows to force JSON response parsing", function(done) {
        var response = {a: "b"};

        XHR.get(this.randomUrl, {mimeType: "json"}).then(this.spy);
        this.mockXhr = jasmine.Ajax.requests.mostRecent();
        this.mockXhr.respondWith({
            "status": 200,
            "contentType": "text/plain",
            "responseText": JSON.stringify(response)
        });

        this.spy.and.callFake(function(data) {
            expect(data).toEqual(response);

            done();
        });
    });
});
