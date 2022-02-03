"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useTokenPriceInUst = exports.default = void 0;

var _terra = require("@arthuryeti/terra");

var _constants = require("../constants");

var _context = require("../context");

var _swap = require("../swap");

const useTokenPriceInUst = token => {
  const {
    routes
  } = (0, _context.useTerraswap)();
  const swapRoute = (0, _swap.useSwapRoute)({
    routes,
    from: token,
    to: _constants.ESTIMATE_TOKEN
  });
  const data = (0, _swap.useSwapSimulate)({
    swapRoute,
    amount: String(_constants.ONE_TOKEN),
    token,
    reverse: false
  });

  if (token == "uusd") {
    return String(_constants.ONE_TOKEN);
  }

  if (data == null) {
    return null;
  }

  return (0, _terra.num)("1").div(data.price).times(_constants.ONE_TOKEN).toFixed();
};

exports.useTokenPriceInUst = useTokenPriceInUst;
var _default = useTokenPriceInUst;
exports.default = _default;