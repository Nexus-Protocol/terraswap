import { BN } from "@arthuryeti/terra";
import { PoolResponse } from "../types";
import { findAsset, getTokenDenom } from "../asset";
import { ONE_TOKEN } from "../constants";

export const toLp = ({ pool, amount1, amount2 }) => {
  return;
};

type FromLpOpts = {
  pool: PoolResponse;
  amount: string;
};

export const fromLp = ({ pool, amount }: FromLpOpts) => {
  if (pool == null || amount == null) {
    return null;
  }

  return [
    BN(amount).times(pool.assets[0].amount).div(pool.total_share),
    BN(amount).times(pool.assets[1].amount).div(pool.total_share),
  ];
};

export const calculateTokenAmount = (
  pool: any,
  token: string,
  amount: string
) => {
  const { assets } = pool;

  const [{ amount: totalAmount1 }, { amount: totalAmount2 }] = [...assets].sort(
    (a) => (getTokenDenom(a.info) === token ? -1 : 1)
  );

  const result = Number(amount) * (Number(totalAmount2) / Number(totalAmount1));

  return String(result.toFixed(6));
};

export const calculateTokensAmounts = (
  pool: any,
  share: string
): Record<string, string> => {
  return pool.assets.reduce(
    (acc, asset) => ({
      ...acc,
      [getTokenDenom(asset.info)]: Math.floor(
        (Number(asset.amount) / Number(pool.total_share)) * Number(share)
      ),
    }),
    {}
  );
};

export const calculateSharePrice = (
  pool: any,
  amount: string,
  token1Price: string,
  token2Price: string
) => {
  if (token1Price == null || token2Price == null || pool == null) {
    return "0";
  }

  const token1 = getTokenDenom(pool.assets[0].info);
  const token2 = getTokenDenom(pool.assets[1].info);
  const tokensAmounts = calculateTokensAmounts(pool, amount);

  if (Number(token1Price) == 0 || Number(token2Price) == 0) {
    return "0";
  }

  const token1TotalPrice =
    (Number(tokensAmounts[token1]) * Number(token1Price)) / ONE_TOKEN;

  const token2TotalPrice =
    (Number(tokensAmounts[token2]) * Number(token2Price)) / ONE_TOKEN;

  return String(token1TotalPrice + token2TotalPrice);
};
