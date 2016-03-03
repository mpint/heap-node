// node.js 0.10 lacks a native Promise implementation, so we use a polyfill.
require("es6-promise").polyfill();

global.chai = require("chai");
global.sinon = require("sinon");
global.chai.use(require("chai-as-promised"));
global.chai.use(require("sinon-chai"));

global.assert = global.chai.assert;
global.expect = global.chai.expect;
