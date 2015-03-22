/* globals XHR */

describe("serialize", function() {
    "use strict";

    it("serializes DOM nodes", function() {
        var node = document.createElement("input");

        node.name = "foo";
        node.value = "bar";
        expect(XHR.serialize(node)).toEqual({ foo: "bar" });

        node.name = "";
        expect(XHR.serialize(node)).toEqual({});
    });

    it("retuns empty object for invalid elements", function() {
        expect(XHR.serialize(document.documentElement)).toEqual({});
    });

    describe("form elements", function() {
        testForm("<input type='text' name='n1' value='v1'>", {n1: "v1"});
        testForm("<input type='checkbox' name='n2' value='v2'>", {});
        testForm("<input type='checkbox' name='n3' value='v3' checked>", {n3: "v3"});
        testForm("<input type='radio' name='n4' value='v4'>", {});
        testForm("<input type='radio' name='n5' value='v5' checked>", {n5: "v5"});
        testForm("<select name='n6'><option value='v6'></option><option value='v66' selected></option></select>", {n6: "v66"});
        testForm("<select name='n7' multiple><option value='v7' selected></option><option value='v77' selected></option></select>", {n7: ["v7", "v77"]});
        testForm("<select name='n8'><option selected>v8</option></select>", {n8: "v8"});
        testForm("<select name='n9' multiple><option value='v9' selected></option><option value='v99' selected><option value='v999' selected></option></select>", {n9: ["v9", "v99", "v999"]});
        testForm("<input type='hidden' name='n1' value='v1 v2'><input type='text' value='v2'>", {n1: "v1 v2"});
        testForm("<input type='checkbox' name='n10' value='1' checked><input type='checkbox' name='n10' value='2' checked><input type='checkbox' name='n10' value='3'>", {n10: ["1", "2"]});
    });

    describe("ignored form elements", function(){
        testForm("<input type='file' name='' value='123'>", {});
        testForm("<input type='file' name='t'>", {});
        testForm("<input type='submit' name='t'>", {});
        testForm("<input type='reset' name='t'>",  {});
        testForm("<input type='button' name='t'>", {});
        testForm("<button type='submit' name='t'></button>", {});
        testForm("<fieldset name='t'></fieldset>", {});
        // test("form>input[type=text name=a value=b]+(fieldset[disabled=disabled]>input[type=text name=c value=d])", {a: "b"});
        // test("form>input[type=text name=a value=b disabled]", {});
    });

    function testForm(html, value) {
        it(html, function() {
            var form = document.createElement("form");

            form.innerHTML = html;

            expect(XHR.serialize(form)).toEqual(value);
        });
    }
});
