import { useMemo } from "react";
import { BN } from "@arthuryeti/terra";

import { getTokenDenom } from "../../asset";
import { PoolResponse } from "../../types";
import { useTokenPriceInUst } from "../../hooks/useTokenPriceInUst";
import { useLpToTokens } from "./useLpToTokens";
import { ONE_TOKEN } from "../../constants";

type Params = {
  pool: PoolResponse;
};

export const useTotalShareInUst = ({ pool }: Params) => {
  const token1 = pool && getTokenDenom(pool?.assets[0].info);
  const token2 = pool && getTokenDenom(pool?.assets[1].info);
  const token1Price = useTokenPriceInUst(token1);
  const token2Price = useTokenPriceInUst(token2);
  const tokenAmounts = useLpToTokens({ pool, amount: pool?.total_share });

  return useMemo(() => {
    if (
      pool == null ||
      token1Price == null ||
      token2Price == null ||
      tokenAmounts == null ||
      BN(pool.total_share).isEqualTo(0)
    ) {
      return null;
    }

    const token1TotalPrice = BN(token1Price)
      .div(ONE_TOKEN)
      .times(tokenAmounts[token1])
      .toFixed();

    const token2TotalPrice = BN(token2Price)
      .div(ONE_TOKEN)
      .times(tokenAmounts[token2])
      .toFixed();

    return BN(token1TotalPrice).plus(token2TotalPrice).toFixed();
  }, [pool, token1Price, token2Price, tokenAmounts]);
};

export default useTotalShareInUst;
