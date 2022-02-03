"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useSwapSimulate = exports.default = void 0;

var _react = require("react");

var _terra = require("@arthuryeti/terra");

var _reactQuery = require("react-query");

var _useContracts = require("../../hooks/useContracts");

var _multiSwap = require("../multiSwap");

var _monoSwap = require("../monoSwap");

function isMultiSimulation(value) {
  return value.hasOwnProperty("amount");
}

function isReverseSimulation(value) {
  return value.hasOwnProperty("offer_amount");
}

const useSwapSimulate = ({
  swapRoute,
  token,
  amount,
  reverse
}) => {
  const {
    client
  } = (0, _terra.useTerraWebapp)();
  const {
    router
  } = (0, _useContracts.useContracts)();
  const {
    data,
    isLoading
  } = (0, _reactQuery.useQuery)(["simulation", swapRoute, router, token, amount, reverse], () => {
    if (swapRoute == null || token == null || amount == null || swapRoute.length == 0) {
      return;
    }

    if (swapRoute.length > 1) {
      return (0, _multiSwap.simulate)({
        client,
        swapRoute,
        router,
        token,
        amount
      });
    }

    return (0, _monoSwap.simulate)({
      client,
      swapRoute,
      token,
      amount,
      reverse
    });
  }, {
    enabled: swapRoute != null
  });
  return (0, _react.useMemo)(() => {
    if (data == null || amount == null || isLoading) {
      return null;
    }

    if (isMultiSimulation(data)) {
      return {
        amount: data.amount,
        spread: "0",
        commission: "0",
        price: (0, _terra.num)(amount).div(data.amount).toFixed(18)
      };
    }

    const spread = data.spread_amount;
    const commission = data.commission_amount;

    if (isReverseSimulation(data)) {
      return {
        amount: data.offer_amount,
        spread,
        commission,
        price: (0, _terra.num)(data.offer_amount).div(amount).toFixed(18)
      };
    }

    return {
      amount: data.return_amount,
      spread,
      commission,
      price: (0, _terra.num)(amount).div(data.return_amount).toFixed(18)
    };
  }, [amount, data, isLoading]);
};

exports.useSwapSimulate = useSwapSimulate;
var _default = useSwapSimulate;
exports.default = _default;