describe("better-xhr", function() {
    "use strict";

    beforeEach(function() {
        this.spy = jasmine.createSpy("callback");

        jasmine.Ajax.install();
    });

    afterEach(function() {
        jasmine.Ajax.uninstall();
    });

    it("should trigger fulfilled handler", function(done) {
        XHR.get("url", {data: {p1: "v1", p2: 123}}).then(this.spy);

        var mockXhr = jasmine.Ajax.requests.mostRecent();

        expect(mockXhr).toBeDefined();
        expect(mockXhr.method).toBe("GET");

        mockXhr.response({
            "status": 200,
            "responseText": "awesome response"
        });

        this.spy.and.callFake(function(text) {
            expect(text).toBe("awesome response");

            done();
        });
    });

    it("should send query string", function() {
        XHR.post("url1", {data: "a=b&c=1"}).then(this.spy);

        var mockXhr = jasmine.Ajax.requests.mostRecent();

        expect(mockXhr.url).toBe("url1");
        expect(mockXhr.method).toBe("POST");
        expect(mockXhr.params).toBe("a=b&c=1");
        expect(mockXhr.requestHeaders).toEqual({"X-Requested-With": "XMLHttpRequest", "Content-Type": "application/x-www-form-urlencoded"});
    });

    it("should serialize object data", function() {
        XHR.post("url2", {data: {"a+b": "c d", v: 1}}).then(this.spy);

        var mockXhr = jasmine.Ajax.requests.mostRecent();

        expect(mockXhr.url).toBe("url2");
        expect(mockXhr.method).toBe("POST");
        expect(mockXhr.params).toBe("a%2Bb=c+d&v=1");
        expect(mockXhr.requestHeaders).toEqual({"X-Requested-With": "XMLHttpRequest", "Content-Type": "application/x-www-form-urlencoded"});
    });

    it("should send json string", function() {
        XHR.post("url", {json: {a: "b", c: 123}}).then(this.spy);

        var mockXhr = jasmine.Ajax.requests.mostRecent();

        expect(mockXhr.url).toBe("url");
        expect(mockXhr.method).toBe("POST");
        expect(mockXhr.params).toBe("{\"a\":\"b\",\"c\":123}");
        expect(mockXhr.requestHeaders).toEqual({"X-Requested-With": "XMLHttpRequest", "Content-Type": "application/json; charset=UTF-8"});
    });

    // it("should not cache GET requests by default", function() {
    //     XHR("get", "url").then(this.spy);

    //     var mockXhr = jasmine.Ajax.requests.mostRecent();

    //     expect(mockXhr.url.indexOf("url?_=")).toBe(0);

    //     XHR({method: "get", url: "url1", cacheBurst: "custom"}).then(this.spy);
    //     mockXhr = jasmine.Ajax.requests.mostRecent();
    //     expect(mockXhr.url.indexOf("url1?custom=")).toBe(0);

    //     XHR({method: "get", url: "url2", cacheBurst: false}).then(this.spy);
    //     mockXhr = jasmine.Ajax.requests.mostRecent();
    //     expect(mockXhr.url).toBe("url2");
    // });
});
