describe("better-xhr", function() {
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

        this.mockXhr.response({
            "status": 200,
            "responseText": "awesome response"
        });

        this.spy.and.callFake(function(text) {
            expect(text).toBe("awesome response");

            done();
        });
    });

    it("should send query string", function() {
        XHR.post("url1", {data: "a=b&c=1", cacheBurst: false}).then(this.spy);

        this.mockXhr = jasmine.Ajax.requests.mostRecent();

        expect(this.mockXhr.url).toBe("url1");
        expect(this.mockXhr.method).toBe("POST");
        expect(this.mockXhr.params).toBe("a=b&c=1");
        expect(this.mockXhr.requestHeaders).toEqual({"X-Requested-With": "XMLHttpRequest", "Content-Type": "application/x-www-form-urlencoded"});
    });

    it("should serialize object data", function() {
        XHR.post("url2", {data: {"a+b": "c d", v: 1}, cacheBurst: false}).then(this.spy);

        this.mockXhr = jasmine.Ajax.requests.mostRecent();

        expect(this.mockXhr.url).toBe("url2");
        expect(this.mockXhr.method).toBe("POST");
        expect(this.mockXhr.params).toBe("a%2Bb=c+d&v=1");
        expect(this.mockXhr.requestHeaders).toEqual({"X-Requested-With": "XMLHttpRequest", "Content-Type": "application/x-www-form-urlencoded"});
    });

    it("should send json string", function() {
        XHR.post("url", {json: {a: "b", c: 123}, cacheBurst: false}).then(this.spy);

        this.mockXhr = jasmine.Ajax.requests.mostRecent();

        expect(this.mockXhr.url).toBe("url");
        expect(this.mockXhr.method).toBe("POST");
        expect(this.mockXhr.params).toBe("{\"a\":\"b\",\"c\":123}");
        expect(this.mockXhr.requestHeaders).toEqual({"X-Requested-With": "XMLHttpRequest", "Content-Type": "application/json; charset=UTF-8"});
    });

    it("should have default settings", function() {
        expect(XHR.defaults).toEqual({
            timeout: 15000,
            cacheBurst: "_",
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            }
        });
    });

    it("should set timeout", function() {
        XHR.get("url1").then(this.spy);
        this.mockXhr = jasmine.Ajax.requests.mostRecent();
        expect(this.mockXhr.timeout).toBe(15000);

        XHR.get("url1", {timeout: 10000}).then(this.spy);
        this.mockXhr = jasmine.Ajax.requests.mostRecent();
        expect(this.mockXhr.timeout).toBe(10000);
    });

    it("should support cache bursting", function() {
        XHR.get("url1").then(this.spy);
        this.mockXhr = jasmine.Ajax.requests.mostRecent();
        expect(this.mockXhr.url.indexOf("url1?_=")).toBe(0);

        XHR.get("url2", {cacheBurst: false}).then(this.spy);
        this.mockXhr = jasmine.Ajax.requests.mostRecent();
        expect(this.mockXhr.url).toBe("url2");
    });

    // it("should handle error responses", function(done) {
    //     var errorSpy = jasmine.createSpy("error"),
    //         spy = this.spy;

    //     errorSpy.and.callFake(function(text) {
    //         expect(spy.not.toHaveBeenCalled());

    //         expect(text).toBeNull();

    //         done();
    //     });

    //     XHR.get("url", {cacheBurst: false}).then(spy, errorSpy);
    //     this.mockXhr = jasmine.Ajax.requests.mostRecent();
    //     this.mockXhr.abort();
    //     this.mockXhr.onabort();
    // });
});
