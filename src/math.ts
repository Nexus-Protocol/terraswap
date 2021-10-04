import BigNumber from "bignumber.js";

type minAmountReceiveParams = {
  amount: string;
  maxSpread: string;
};

export const minAmountReceive = ({
  amount,
  maxSpread,
}: minAmountReceiveParams): string => {
  const rate1 = new BigNumber(1).minus(maxSpread);
  const rate2 = new BigNumber(1).minus("0.003"); // terraswap commission

  return new BigNumber(amount).times(rate1).times(rate2).toString();
};

type PriceImpactParams = {
  offerAmount: string;
  maxSpread: string;
};

export const priceImpact = ({
  offerAmount,
  maxSpread,
}: PriceImpactParams): string => {
  const amount = new BigNumber(offerAmount);
  const spread = new BigNumber(maxSpread);

  return spread.div(amount.plus(spread)).times("100").toString();
};
