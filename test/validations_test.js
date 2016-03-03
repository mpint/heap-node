var validations = require("../lib/validations.js");

describe("heap/validations", function() {
  describe(".normalizeAppId", function() {
    it("rejects non-strings", function() {
      var values = [null, 0, 1, 42, true, false, undefined, [], {},
          function() {}];
      for (var i = 0; i < values.length; ++i) {
        var value = values[0];
        expect(function() { validations.normalizeAppId(value); }).to.
            throw(TypeError, "Invalid Heap application ID: " + value);
      }
    });

    it("rejects empty strings", function() {
      expect(function() { validations.normalizeAppId(""); }).to.
          throw(RangeError, "Empty Heap application ID");
    });

    it("returns the argument", function() {
      expect(validations.normalizeAppId("test-app-id")).to.
          equal("test-app-id");
    });
  });

  describe(".normalizeIdentity", function() {
    it("rejects invalid types", function() {
      var values = [null, true, false, undefined, [], {}, function() {}];
      for (var i = 0; i < values.length; ++i) {
        var value = values[0];
        expect(function() { validations.normalizeIdentity(value); }).to.
            throw(TypeError, "Invalid identity: " + value);
      }
    });

    it("rejects empty strings", function() {
      expect(function() { validations.normalizeIdentity(""); }).to.
          throw(RangeError, "Empty identity");
    });

    it("rejects long strings", function() {
      longIdentity = new Array(257).join("A")
      expect(function() { validations.normalizeIdentity(longIdentity); }).to.
          throw(RangeError, "Identity " + longIdentity + " too long; 256 is " +
          "above the 255-character limit");
    });


    it("returns a string argument", function() {
      expect(validations.normalizeIdentity("test-identity")).to.
          equal("test-identity");
    });

    it("stringifies a number argument", function() {
      expect(validations.normalizeIdentity(42)).to.
          equal("42");
    });
  });

  describe(".normalizeEventName", function() {
    it("rejects invalid types", function() {
      var values = [null, 0, 1, 42, true, false, undefined, [], {},
          function() {}];
      for (var i = 0; i < values.length; ++i) {
        var value = values[0];
        expect(function() { validations.normalizeEventName(value); }).to.
            throw(TypeError, "Invalid event name: " + value);
      }
    });

    it("rejects empty strings", function() {
      expect(function() { validations.normalizeEventName(""); }).to.
          throw(RangeError, "Empty event name");
    });

    it("rejects long strings", function() {
      longEventName = new Array(1026).join("A")
      expect(function() { validations.normalizeEventName(longEventName); }).to.
          throw(RangeError, "Event name " + longEventName +
          " too long; 1025 is above the 1024-character limit");
    });

    it("returns the argument", function() {
      expect(validations.normalizeEventName("test-event")).to.
          equal("test-event");
    });
  });


  describe(".normalizeProperties", function() {
    it("rejects invalid types", function() {
      var values = [null, 0, 1, 42, true, false, undefined, [],
          function() {}];
      for (var i = 0; i < values.length; ++i) {
        var value = values[0];
        expect(function() { validations.normalizeProperties(value); }).to.
            throw(TypeError, "Invalid properties: " + value);
      }
    });

    it("rejects long keys", function() {
      properties = {};
      longKey = new Array(1026).join("A");
      properties[longKey] = "value";
      expect(function() {
        validations.normalizeProperties(properties);
      }).to.throw(Error, "Property name " + longEventName + " too long; 1025" +
          " is above the 1024-character limit");
    });

    it("rejects long string values", function() {
      longValue = new Array(1026).join("A");
      expect(function() {
        validations.normalizeProperties({ longKey: longValue });
      }).to.throw(Error, "Property longKey value " + longValue + " too long;" +
          " 1025 is above the 1024-character limit");
    });

    it("rejects invalid value types", function() {
      var values = [null, true, false, undefined, [], {}, function() {}];
      for (var i = 0; i < values.length; ++i) {
        var value = values[0];
        expect(function() {
          validations.normalizeProperties({ key: value });
        }).to.throw(Error, "Unsupported type for property key value: " +
            value);
      }
    });

    it("returns the argument", function() {
      properties = { key: "value", number: 42 };
      expect(validations.normalizeProperties(properties)).to.equal(properties);
    });
  });
});
