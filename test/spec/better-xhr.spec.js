describe("better-xhr", function() {
    "use strict";

    beforeEach(function() {
        jasmine.Ajax.install();
    });

    afterEach(function() {
        jasmine.Ajax.uninstall();
    });

    it("should trigger fulfilled handler", function() {
        var xhr = XHR("get", "url1", {p1: "v1", p2: 123}),
            spy = jasmine.createSpy("callback"),
            mockXhr = jasmine.Ajax.requests.mostRecent();

        expect(mockXhr).toBeUndefined();

        xhr.then(spy);

        mockXhr = jasmine.Ajax.requests.mostRecent();

        expect(mockXhr).toBeDefined();
        expect(mockXhr.url).toBe("url1");
        expect(mockXhr.method).toBe("GET");

        mockXhr.response({
            "status": 200,
            "responseText": "awesome response"
        });

        expect(spy).toHaveBeenCalledWith("awesome response");
    });
});
