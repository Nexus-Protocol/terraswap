"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cw = require("./cw20");

Object.keys(_cw).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _cw[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _cw[key];
    }
  });
});

var _local = require("./local");

Object.keys(_local).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _local[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _local[key];
    }
  });
});

var _terraswap = require("./terraswap");

Object.keys(_terraswap).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _terraswap[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _terraswap[key];
    }
  });
});