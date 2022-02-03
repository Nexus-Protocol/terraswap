"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useLpToTokens = exports.default = void 0;

var _react = require("react");

var _terra = require("@arthuryeti/terra");

var _asset = require("../../asset");

const useLpToTokens = ({
  pool,
  amount
}) => {
  return (0, _react.useMemo)(() => {
    if (pool == null || amount == null || (0, _terra.num)(amount).isEqualTo(0)) {
      return null;
    }

    const {
      assets,
      total_share
    } = pool;
    return assets.reduce((acc, asset) => ({ ...acc,
      [(0, _asset.getTokenDenom)(asset.info)]: (0, _terra.num)(amount).times(asset.amount).div(total_share).toFixed()
    }), {});
  }, [pool, amount]);
};

exports.useLpToTokens = useLpToTokens;
var _default = useLpToTokens;
exports.default = _default;