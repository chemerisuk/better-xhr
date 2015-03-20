/* globals XHR */

describe("XHR", function() {
    "use strict";

    beforeEach(function() {
        this.spy = jasmine.createSpy("callback");

        jasmine.Ajax.install();
    });

    afterEach(function() {
        jasmine.Ajax.uninstall();

        this.mockXhr = null;
    });

    it("should trigger fulfilled handler", function(done) {
        XHR.get("url", {cacheBurst: false}).then(this.spy);

        this.mockXhr = jasmine.Ajax.requests.mostRecent();

        expect(this.mockXhr).toBeDefined();
        expect(this.mockXhr.url).toBe("url");
        expect(this.mockXhr.method).toBe("GET");

        this.mockXhr.respondWith({
            "status": 200,
            "contentType": "text/plain",
            "responseText": "awesome response"
        });

        this.spy.and.callFake(function(text) {
            expect(text).toBe("awesome response");

            done();
        });
    });

    it("should send query string for POST requests", function() {
        XHR.post("url1", {data: "a=b&c=1", cacheBurst: false}).then(this.spy);

        this.mockXhr = jasmine.Ajax.requests.mostRecent();

        expect(this.mockXhr.url).toBe("url1");
        expect(this.mockXhr.method).toBe("POST");
        expect(this.mockXhr.params).toBe("a=b&c=1");
        expect(this.mockXhr.requestHeaders).toEqual({"X-Requested-With": "XMLHttpRequest", "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"});
    });

    it("should send query string for GET requests", function() {
        XHR.get("url3", {data: "a=b&c=1", cacheBurst: false}).then(this.spy);

        this.mockXhr = jasmine.Ajax.requests.mostRecent();

        expect(this.mockXhr.url).toBe("url3?a=b&c=1");
        expect(this.mockXhr.method).toBe("GET");
        expect(this.mockXhr.params).toBeNull();
        expect(this.mockXhr.requestHeaders).toEqual({"X-Requested-With": "XMLHttpRequest"});
    });

    it("should support array values in data", function() {
        XHR.post("url4", {data: {a: ["1", "2"]}, cacheBurst: false}).then(this.spy);

        this.mockXhr = jasmine.Ajax.requests.mostRecent();

        expect(this.mockXhr.url).toBe("url4");
        expect(this.mockXhr.method).toBe("POST");
        expect(this.mockXhr.params).toBe("a=1&a=2");
        expect(this.mockXhr.requestHeaders).toEqual({"X-Requested-With": "XMLHttpRequest", "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"});
    });

    it("should serialize object data", function() {
        XHR.post("url2", {data: {"a+b": "c d", v: 1}, cacheBurst: false}).then(this.spy);

        this.mockXhr = jasmine.Ajax.requests.mostRecent();

        expect(this.mockXhr.url).toBe("url2");
        expect(this.mockXhr.method).toBe("POST");
        expect(this.mockXhr.params).toBe("a%2Bb=c+d&v=1");
        expect(this.mockXhr.requestHeaders).toEqual({"X-Requested-With": "XMLHttpRequest", "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"});
    });

    it("should send json string", function() {
        XHR.post("url", {json: {a: "b", c: 123}, cacheBurst: false}).then(this.spy);

        this.mockXhr = jasmine.Ajax.requests.mostRecent();

        expect(this.mockXhr.url).toBe("url");
        expect(this.mockXhr.method).toBe("POST");
        expect(this.mockXhr.params).toBe("{\"a\":\"b\",\"c\":123}");
        expect(this.mockXhr.requestHeaders).toEqual({"X-Requested-With": "XMLHttpRequest", "Content-Type": "application/json; charset=UTF-8"});
    });

    it("handles error responses", function(done) {
        XHR.get("url", {cacheBurst: false}).catch(this.spy);
        this.mockXhr = jasmine.Ajax.requests.mostRecent();
        this.mockXhr.respondWith({
            "status": 500,
            "contentType": "text/plain",
            "responseText": "error response"
        });

        this.spy.and.callFake(function(response) {
            expect(response).toBe("error response");

            done();
        });
    });

    it("should handle timeouts", function(done) {
        XHR.get("url", {cacheBurst: false}).catch(this.spy);
        this.mockXhr = jasmine.Ajax.requests.mostRecent();
        this.mockXhr.ontimeout();

        this.spy.and.callFake(function(err) {
            expect(err instanceof Error).toBe(true);
            expect(err.message).toBe("timeout");

            done();
        });
    });

    it("should handle aborted responses", function(done) {
        XHR.get("url", {cacheBurst: false}).catch(this.spy);
        this.mockXhr = jasmine.Ajax.requests.mostRecent();
        this.mockXhr.onabort();

        this.spy.and.callFake(function(err) {
            expect(err instanceof Error).toBe(true);
            expect(err.message).toBe("abort");

            done();
        });
    });

    it("should handle errored responses", function(done) {
        XHR.get("url", {cacheBurst: false}).catch(this.spy);
        this.mockXhr = jasmine.Ajax.requests.mostRecent();
        this.mockXhr.onerror();

        this.spy.and.callFake(function(err) {
            expect(err instanceof Error).toBe(true);
            expect(err.message).toBe("error");

            done();
        });
    });

    it("parses JSON reponses", function(done) {
        var response = {a: "b"};

        XHR.get("url", {json: false}).then(this.spy);
        this.mockXhr = jasmine.Ajax.requests.mostRecent();
        this.mockXhr.respondWith({
            "status": 200,
            "contentType": "application/json",
            "responseText": JSON.stringify(response)
        });

        this.spy.and.callFake(function(data) {
            expect(data).toEqual(response);

            done();
        });
    });

    it("returns error for invalid JSON reponses", function(done) {
        XHR.get("url", {json: false}).catch(this.spy);
        this.mockXhr = jasmine.Ajax.requests.mostRecent();
        this.mockXhr.respondWith({
            "status": 200,
            "contentType": "application/json",
            "responseText": "{123:123}"
        });

        this.spy.and.callFake(function(err) {
            expect(err instanceof Error).toBe(true);

            done();
        });
    });
});
