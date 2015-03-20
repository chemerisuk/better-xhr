/* globals XHR */

describe("XHR properties", function() {
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

    it("should have default settings", function() {
        expect(XHR.defaults).toEqual({
            timeout: 15000,
            cacheBurst: "_",
            charset: "UTF-8",
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            }
        });
    });

    it("allows to override default headers", function() {
        XHR.get("url4", {cacheBurst: false, headers: {"X-Requested-With": null}}).then(this.spy);

        this.mockXhr = jasmine.Ajax.requests.mostRecent();

        expect(this.mockXhr.url).toBe("url4");
        expect(this.mockXhr.method).toBe("GET");
        expect(this.mockXhr.params).toBeUndefined();
        expect(this.mockXhr.requestHeaders).toEqual({});
    });

    it("should set timeout", function() {
        XHR.get("url1").then(this.spy);
        this.mockXhr = jasmine.Ajax.requests.mostRecent();
        expect(this.mockXhr.timeout).toBe(15000);

        XHR.get("url1", {timeout: 10000}).then(this.spy);
        this.mockXhr = jasmine.Ajax.requests.mostRecent();
        expect(this.mockXhr.timeout).toBe(10000);
    });

    describe("cache bursting", function() {
        it("should append extra param by default", function() {
            XHR.get("url1").then(this.spy);
            this.mockXhr = jasmine.Ajax.requests.mostRecent();
            expect(this.mockXhr.url.indexOf("url1?" + XHR.defaults.cacheBurst)).toBe(0);

            XHR.get("url2", {cacheBurst: false}).then(this.spy);
            this.mockXhr = jasmine.Ajax.requests.mostRecent();
            expect(this.mockXhr.url).toBe("url2");
        });

        it("should work only for GET requests", function() {
            XHR.post("url", {a: "b"}).then(this.spy);
            this.mockXhr = jasmine.Ajax.requests.mostRecent();
            expect(this.mockXhr.url).toBe("url");
        });
    });

    it("can emulate extra HTTP methods", function() {
        XHR.put(this.randomUrl, {emulateHTTP: "_method"}).then(this.spy);

        this.mockXhr = jasmine.Ajax.requests.mostRecent();

        expect(this.mockXhr.url).toBe(this.randomUrl + "?_method=PUT");
        expect(this.mockXhr.method).toBe("POST");
        expect(this.mockXhr.params).toBeUndefined();
        expect(this.mockXhr.requestHeaders).toEqual({
            "X-Requested-With": "XMLHttpRequest",
            "X-Http-Method-Override": "PUT"
        });
    });
});
