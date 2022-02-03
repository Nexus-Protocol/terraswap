"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useTotalShareInUst = exports.default = void 0;

var _react = require("react");

var _terra = require("@arthuryeti/terra");

var _asset = require("../../asset");

var _useTokenPriceInUst = require("../../hooks/useTokenPriceInUst");

var _constants = require("../../constants");

const useTotalShareInUst = ({
  pool
}) => {
  const token1 = pool && (0, _asset.getTokenDenom)(pool.assets[0].info);
  const token2 = pool && (0, _asset.getTokenDenom)(pool.assets[1].info);
  const token1Price = (0, _useTokenPriceInUst.useTokenPriceInUst)(token1);
  const token2Price = (0, _useTokenPriceInUst.useTokenPriceInUst)(token2);
  const tokenAmounts = (0, _react.useMemo)(() => {
    if (pool == null) {
      return null;
    }

    return {
      [(0, _asset.getTokenDenom)(pool.assets[0].info)]: pool.assets[0].amount,
      [(0, _asset.getTokenDenom)(pool.assets[1].info)]: pool.assets[1].amount
    };
  }, [pool]);
  return (0, _react.useMemo)(() => {
    if (pool == null || token1 == null || token2 == null || token1Price == null || token2Price == null || tokenAmounts == null || (0, _terra.num)(pool.total_share).isEqualTo(0)) {
      return null;
    }

    const totalPrice1 = (0, _terra.num)(tokenAmounts[token1]).times(token1Price).div(_constants.ONE_TOKEN);
    const totalPrice2 = (0, _terra.num)(tokenAmounts[token2]).times(token2Price).div(_constants.ONE_TOKEN);
    return totalPrice1.plus(totalPrice2).toFixed();
  }, [pool, token1, token2, token1Price, token2Price, tokenAmounts]);
};

exports.useTotalShareInUst = useTotalShareInUst;
var _default = useTotalShareInUst;
exports.default = _default;