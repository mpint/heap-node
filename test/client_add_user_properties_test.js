var nock = require("nock");
var heap = require("..");

describe("Client#addUserProperties", function() {
  beforeEach(function() {
    this.client = heap("test-app-id");
  });

  it("throws when the client has an invalid application ID", function() {
    var client = this.client;
    client.appId = null;
    expect(function() {
      client.addUserProperties("test-identity", { "key": "value" });
    }).to.throw(TypeError, "Invalid Heap application ID: null");
  });

  it("throws when the identity is invalid", function() {
    var client = this.client;
    expect(function() {
      client.addUserProperties(null, { "key": "value" });
    }).to.throw(TypeError, "Invalid identity: null");
  });

  it("throws when the properties dictionary is invalid", function() {
    var client = this.client;
    expect(function() {
      client.addUserProperties("test-identity", true);
    }).to.throw(TypeError, "Invalid properties: true");
  });

  describe("with a mock backend", function() {
    beforeEach(function() {
      this.nock = nock("https://heapanalytics.com");
      nock.disableNetConnect();
    });
    afterEach(function() {
      var nockIsDone = nock.isDone();
      if (!nockIsDone)
        console.error("Pending HTTP requests: %j", nock.pendingMocks());
      nock.enableNetConnect();
      nock.cleanAll();
      if (!nockIsDone)
        throw Error("Test failed to issue all expected HTTP requests");
    });

    it("works with string identities", function() {
      this.nock.post("/api/identify").reply(204, function(uri, requestBody) {
        expect(requestBody).to.deep.equal({
          app_id: "test-app-id", identity: "test-identity",
          properties: { foo: "bar" },
        });
      });

      return expect(this.client.addUserProperties("test-identity",
          { foo: "bar" })).to.become(true);
    });

    it("works with integer identities", function() {
      this.nock.post("/api/identify").reply(204, function(uri, requestBody) {
        expect(requestBody).to.deep.equal({
          app_id: "test-app-id", identity: "123456789",
          properties: { foo: "bar" },
        });
      });

      return expect(this.client.addUserProperties(123456789, { foo: "bar" })).
          to.become(true);
    });

    it("works with a callback", function(done) {
      this.nock.post("/api/identify").reply(204, function(uri, requestBody) {
        expect(requestBody).to.deep.equal({
          app_id: "test-app-id", identity: "test-identity",
          properties: { foo: "bar" },
        });
      });

      this.client.addUserProperties("test-identity", { foo: "bar" },
          function(error) {
        expect(error).to.be.undefined;
        done();
      });
    });
  });

  describe("with a stubbed client", function() {
    beforeEach(function() {
      this.client.stubbed = true;
    });

    it("succeeds", function() {
      return expect(this.client.addUserProperties("test-identity",
          { foo: "bar" })).to.become(true);
    });
  });

  describe("when talking to the real backend", function() {
    beforeEach(function() {
      this.client.appId = "3000610572";
    });

    it("succeeds", function() {
      return expect(this.client.addUserProperties("test-identity",
          { "language/node": "1", "heap/heap-node": 1 })).to.become(true);
    });
  });
});
