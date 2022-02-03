"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.priceImpact = exports.minAmountReceive = void 0;

var _terra = require("@arthuryeti/terra");

const minAmountReceive = ({
  amount,
  maxSpread
}) => {
  const rate1 = (0, _terra.num)("1").minus(maxSpread);
  return (0, _terra.num)(amount).times(rate1).toString();
};

exports.minAmountReceive = minAmountReceive;

const priceImpact = ({
  offerAmount,
  maxSpread
}) => {
  const amount = (0, _terra.num)(offerAmount);
  const spread = (0, _terra.num)(maxSpread);
  return spread.div(amount.plus(spread)).times("100").toString();
};

exports.priceImpact = priceImpact;