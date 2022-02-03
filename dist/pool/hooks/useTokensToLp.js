"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useTokensToLp = exports.default = void 0;

var _react = require("react");

var _terra = require("@arthuryeti/terra");

var _useShareOfPool = require("./useShareOfPool");

const useTokensToLp = ({
  pool,
  amount1
}) => {
  const shareOfPool = (0, _useShareOfPool.useShareOfPool)({
    pool,
    amount1
  });
  return (0, _react.useMemo)(() => {
    if (pool == null || amount1 == null || shareOfPool == null || (0, _terra.num)(amount1).isEqualTo(0)) {
      return null;
    }

    return (0, _terra.num)(shareOfPool).times(pool.total_share).toFixed();
  }, [pool, shareOfPool, amount1]);
};

exports.useTokensToLp = useTokensToLp;
var _default = useTokensToLp;
exports.default = _default;