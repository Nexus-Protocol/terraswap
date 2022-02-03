"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _useTokensToLp = require("./hooks/useTokensToLp");

Object.keys(_useTokensToLp).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _useTokensToLp[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _useTokensToLp[key];
    }
  });
});

var _useLpToTokens = require("./hooks/useLpToTokens");

Object.keys(_useLpToTokens).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _useLpToTokens[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _useLpToTokens[key];
    }
  });
});

var _useShareOfPool = require("./hooks/useShareOfPool");

Object.keys(_useShareOfPool).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _useShareOfPool[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _useShareOfPool[key];
    }
  });
});

var _useTotalShareInUst = require("./hooks/useTotalShareInUst");

Object.keys(_useTotalShareInUst).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _useTotalShareInUst[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _useTotalShareInUst[key];
    }
  });
});