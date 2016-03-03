var nock = require("nock");
var heap = require("..");

describe("Client#_request", function() {
  beforeEach(function() {
    this.client = heap("test-app-id");
    this.requestOptions = {
      url: "https://heapanalytics.com/api/identify",
      json: {
        app_id: "test-app-id",
        identity: "test-identity",
        properties: { "language/node": "1" },
      }
    };
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

    it("encodes the JSON payload correctly", function() {
      this.nock.post("/api/identify").reply(204, function(uri, requestBody) {
        expect(this.req.headers["content-type"]).to.equal("application/json");
        expect(requestBody).to.deep.equal({
          app_id: "test-app-id", identity: "test-identity",
          properties: { "language/node": "1" },
        });
      });

      return expect(this.client._request(this.requestOptions)).to.become(true);
    });

    it("sets the user-agent string correctly", function() {
      this.client.userAgent = "test/user/agent";
      this.nock.post("/api/identify").reply(204, function(uri, requestBody) {
        expect(this.req.headers["user-agent"]).to.equal("test/user/agent");
      });


      return expect(this.client._request(this.requestOptions)).to.become(true);
    });

    it("calls the callback if the API call succeeds", function(done) {
      this.nock.post("/api/identify").reply(204, function() {});
      this.client._request(this.requestOptions, function(error) {
        expect(error).to.be.undefined;
        done();
      });
    });

    it("reports server errors to callback", function(done) {
      this.nock.post("/api/identify").reply(400, "Bad request");

      this.client._request(this.requestOptions, function(error) {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal("Heap API server error 400");
        done();
      });
    });

    it("reports request errors to callback", function(done) {
      this.nock.post("/api/identify").replyWithError("Mock request error");

      this.client._request(this.requestOptions, function(error) {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal("Mock request error");
        done();
      });
    });

    it("rejects the returned promise on server errors", function() {
      this.nock.post("/api/identify").reply(400, "Bad request");

      return expect(this.client._request(this.requestOptions)).to.eventually.
        be.rejectedWith(Error, /^Error: Heap API server error 400$/);
    });

    it("rejects the returned promise on request errors", function() {
      this.nock.post("/api/identify").replyWithError("Mock request error");

      return expect(this.client._request(this.requestOptions)).to.eventually.
        be.rejectedWith(Error, /^Error: Mock request error$/);
    });

    it("calls the callback before the promise is resolved", function(done) {
      this.nock.post("/api/identify").reply(204, function() {});

      var promiseResolved = false;
      var callbackCalled = false;
      this.client._request(this.requestOptions, function(error) {
        expect(error).to.be.undefined;
        expect(promiseResolved).to.equal(false);
        expect(callbackCalled).to.equal(false);
        callbackCalled = true;
      }).then(function() {
        expect(promiseResolved).to.equal(false);
        promiseResolved = true;
        expect(callbackCalled).to.equal(true);
        done();
      });
    });

    it("calls the callback before the promise is rejected", function(done) {
      this.nock.post("/api/identify").reply(400, "Bad request");

      var promiseRejected = false;
      var callbackCalled = false;
      this.client._request(this.requestOptions, function(error) {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal("Heap API server error 400");
        expect(promiseRejected).to.equal(false);
        expect(callbackCalled).to.equal(false);
        callbackCalled = true;
      }).catch(function(error) {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal("Heap API server error 400");
        expect(promiseRejected).to.equal(false);
        promiseRejected = true;
        expect(callbackCalled).to.equal(true);
        done();
      });
    });
  });

  describe("with a stubbed client", function() {
    beforeEach(function() {
      this.client.stubbed = true;
    });

    it("calls the callback, when provided", function(done) {
      this.client._request(this.requestOptions, function (error) {
        expect(error).to.be.undefined;
        done();
      });
    });
  });

  describe("when talking to the real backend", function() {
    beforeEach(function() {
      this.requestOptions.json.app_id = this.client.appId = "3000610572";
    });

    it("succeeds", function() {
      return expect(this.client._request(this.requestOptions)).to.become(true);
    });
  });
});
