import BigNumber from "bignumber.js";

type minAmountReceiveParams = {
  offerAmount: string;
  beliefPrice: string;
  maxSpread: string;
  commission: string;
};

export const minAmountReceive = ({
  offerAmount,
  beliefPrice,
  maxSpread,
  commission,
}: minAmountReceiveParams): string => {
  const amount = new BigNumber(offerAmount).div(beliefPrice);
  const rate1 = new BigNumber(1).minus(maxSpread);
  const rate2 = new BigNumber(1).minus(commission);

  return amount.times(rate1).times(rate2).toString();
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
