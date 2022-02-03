"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useShareOfPool = exports.default = void 0;

var _react = require("react");

var _terra = require("@arthuryeti/terra");

const useShareOfPool = ({
  pool,
  amount1
}) => {
  return (0, _react.useMemo)(() => {
    if (pool == null || amount1 == null || (0, _terra.num)(pool.total_share).isEqualTo(0)) {
      return null;
    }

    const token1Amount = pool.assets[0].amount;
    return (0, _terra.num)(amount1).div(token1Amount).toFixed(2);
  }, [pool, amount1]);
};

exports.useShareOfPool = useShareOfPool;
var _default = useShareOfPool;
exports.default = _default;