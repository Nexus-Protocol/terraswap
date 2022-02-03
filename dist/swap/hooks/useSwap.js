"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useSwap = exports.default = void 0;

var _react = require("react");

var _terra = require("@arthuryeti/terra");

var _monoSwap = require("../monoSwap");

var _helpers = require("../helpers");

var _context = require("../../context");

var _useSwapRoute = require("./useSwapRoute");

var _useSwapSimulate = require("./useSwapSimulate");

const useSwap = ({
  token1,
  token2,
  amount1,
  amount2,
  slippage,
  reverse = false,
  onSuccess,
  onError
}) => {
  const {
    routes
  } = (0, _context.useTerraswap)();
  const address = (0, _terra.useAddress)();
  const swapRoute = (0, _useSwapRoute.useSwapRoute)({
    routes,
    from: token1,
    to: token2
  });
  const simulated = (0, _useSwapSimulate.useSwapSimulate)({
    swapRoute,
    amount: reverse ? amount2 : amount1,
    token: reverse ? token2 : token1,
    reverse
  });
  const minReceive = (0, _react.useMemo)(() => {
    if (simulated == null || amount2 == null) {
      return null;
    }

    return (0, _helpers.minAmountReceive)({
      amount: reverse ? amount2 : simulated.amount,
      maxSpread: slippage
    });
  }, [simulated, slippage, amount2, reverse]);
  const msgs = (0, _react.useMemo)(() => {
    if (swapRoute == null || token1 == null || amount1 == null || simulated == null) {
      return null;
    }

    if (swapRoute.length > 1) {
      return null;
    }

    return (0, _monoSwap.createSwapMsgs)({
      token: token1,
      swapRoute,
      amount: amount1,
      slippage,
      price: simulated.price
    }, address);
  }, [address, token1, amount1, simulated, slippage, swapRoute]);
  const {
    submit,
    ...rest
  } = (0, _terra.useTransaction)({
    msgs,
    onSuccess,
    onError
  });
  return { ...rest,
    simulated,
    minReceive,
    swap: submit
  };
};

exports.useSwap = useSwap;
var _default = useSwap;
exports.default = _default;