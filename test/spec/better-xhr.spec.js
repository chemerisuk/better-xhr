describe("better-xhr", function() {
    "use strict";

    beforeEach(function() {
        this.spy = jasmine.createSpy("callback");

        jasmine.Ajax.install();
    });

    afterEach(function() {
        jasmine.Ajax.uninstall();
    });

    it("should trigger fulfilled handler", function() {
        var xhr = XHR("get", "url", {p1: "v1", p2: 123}),
            mockXhr = jasmine.Ajax.requests.mostRecent();

        expect(mockXhr).toBeUndefined();

        xhr.then(this.spy);

        mockXhr = jasmine.Ajax.requests.mostRecent();

        expect(mockXhr).toBeDefined();
        expect(mockXhr.url).toBe("url");
        expect(mockXhr.method).toBe("GET");

        mockXhr.response({
            "status": 200,
            "responseText": "awesome response"
        });

        expect(this.spy).toHaveBeenCalledWith("awesome response");
    });

    it("should send query string", function() {
        XHR("post", "url1", "a=b&c=1").then(this.spy);

        var mockXhr = jasmine.Ajax.requests.mostRecent();

        expect(mockXhr.url).toBe("url1");
        expect(mockXhr.method).toBe("POST");
        expect(mockXhr.params).toBe("a=b&c=1");
        expect(mockXhr.requestHeaders).toEqual({"X-Requested-With": "XMLHttpRequest", "Content-Type": "application/x-www-form-urlencoded"});

        XHR("post", "url2", {"a+b": "c d", v: 1}).then(this.spy);

        mockXhr = jasmine.Ajax.requests.mostRecent();

        expect(mockXhr.url).toBe("url2");
        expect(mockXhr.method).toBe("POST");
        expect(mockXhr.params).toBe("a%2Bb=c+d&v=1");
        expect(mockXhr.requestHeaders).toEqual({"X-Requested-With": "XMLHttpRequest", "Content-Type": "application/x-www-form-urlencoded"});
    });

    it("should send json string", function() {
        XHR({headers: {"Content-Type": "application/json"}, method: "post", url: "url", data: {a: "b", c: 123}}).then(this.spy);

        var mockXhr = jasmine.Ajax.requests.mostRecent();

        expect(mockXhr.url).toBe("url");
        expect(mockXhr.method).toBe("POST");
        expect(mockXhr.params).toBe("{\"a\":\"b\",\"c\":123}");
        expect(mockXhr.requestHeaders).toEqual({"Content-Type": "application/json"});
    });
});
