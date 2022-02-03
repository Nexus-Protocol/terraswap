"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useContracts = exports.default = void 0;

var _react = require("react");

var _terra = require("@arthuryeti/terra");

const defaultContracts = {
  mainnet: {
    factory: "terra1fnywlw4edny3vw44x04xd67uzkdqluymgreu7g",
    router: "terra16t7dpwwgx9n3lq6l6te3753lsjqwhxwpday9zx"
  },
  testnet: {
    factory: "terra15jsahkaf9p0qu8ye873p0u5z6g07wdad0tdq43",
    router: "terra13wf295fj9u209nknz2cgqmmna7ry3d3j5kv7t4"
  }
};

const useContracts = initial => {
  const {
    network: {
      name
    }
  } = (0, _terra.useTerraWebapp)();
  const contracts = initial != null ? initial : defaultContracts;
  return (0, _react.useMemo)(() => {
    return contracts[name];
  }, [contracts, name]);
};

exports.useContracts = useContracts;
var _default = useContracts;
exports.default = _default;