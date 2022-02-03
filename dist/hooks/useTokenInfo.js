"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useTokenInfo = exports.default = void 0;

var _react = require("react");

var _terra = require("@arthuryeti/terra");

var _context = require("../context");

const useTokenInfo = () => {
  const {
    network: {
      name
    }
  } = (0, _terra.useTerraWebapp)();
  const {
    data
  } = (0, _context.useTerraswap)();
  const getSymbol = (0, _react.useCallback)(token => {
    if (data == null || token == null) {
      return null;
    }

    return data[name].tokens[token].symbol || token;
  }, [name, data]);
  const getIcon = (0, _react.useCallback)(token => {
    if (data == null || token == null) {
      return null;
    }

    const info = data[name].tokens[token];
    return info.icon || null;
  }, [name, data]);
  return {
    getSymbol,
    getIcon
  };
};

exports.useTokenInfo = useTokenInfo;
var _default = useTokenInfo;
exports.default = _default;