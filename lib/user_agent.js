/**
 * The default user-agent value for heap clients.
 *
 * This is expensive to compute, so we memoize it.
 *
 * @module heap-api/user_agent
 * @private
 * @type {string}
 */

var fs = require("fs");

/**
 * The version of the heap npm package.
 * @private
 * @var {string}
 */
var heapVersion = JSON.parse(fs.readFileSync(
    require.resolve("../package.json"), { encoding: "utf-8" })).version;

/**
 * The version of the request npm package.
 * @private
 * @var {string}
 */
var requestVersion = JSON.parse(fs.readFileSync(
    require.resolve("request/package.json"), { encoding: "utf-8" })).version;

module.exports = "heap-node/" + heapVersion +
    " request/" + requestVersion + " node/" + process.versions.node +
    " (" + process.arch + " " + process.platform + ")" +
    " openssl/" + process.versions.openssl;
