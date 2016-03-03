var userAgent = require("../lib/user_agent.js");

describe("heap/user_agent", function() {
  it("contains heap-node version", function() {
    expect(userAgent).to.match(/^heap-node\/[\d.]+ /);
  });
  it("contains request version", function() {
    expect(userAgent).to.match(/ request\/[\d.]+ /);
  });
  it("contains node version, architecture and platform", function() {
    expect(userAgent).to.match(/ node\/[\d.]+ \(.+ .+\) /);
  });
  it("contains openssl version", function() {
    expect(userAgent).to.match(/ openssl\/\S+$/);
  });
});
