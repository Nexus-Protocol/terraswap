import { useMemo } from "react";
import { num } from "@arthuryeti/terra";

import { getTokenDenom } from "../../asset";
import { PoolResponse } from "../../types";
import { useTokenPriceInUst } from "../../hooks/useTokenPriceInUst";
import { ONE_TOKEN } from "../../constants";
import { useLpToTokens } from "./useLpToTokens";

type Params = {
  pool: PoolResponse | null;
};

export const useTotalShareInUst = ({ pool }: Params) => {
  const token1 = pool && getTokenDenom(pool.assets[0].info);
  const token2 = pool && getTokenDenom(pool.assets[1].info);
  const token1Price = useTokenPriceInUst(token1);
  const token2Price = useTokenPriceInUst(token2);
  const tokenAmounts = useLpToTokens({ pool, amount: pool?.total_share });

  return useMemo(() => {
    if (
      pool == null ||
      token1 == null ||
      token2 == null ||
      token1Price == null ||
      token2Price == null ||
      tokenAmounts == null ||
      num(pool.total_share).isEqualTo(0)
    ) {
      return null;
    }

    const totalPrice1 = num(tokenAmounts[token1])
      .times(token1Price)
      .div(ONE_TOKEN);

    const totalPrice2 = num(tokenAmounts[token2])
      .times(token2Price)
      .div(ONE_TOKEN);

    return totalPrice1.plus(totalPrice2).toFixed();
  }, [pool, token1, token2, token1Price, token2Price, tokenAmounts]);
};

export default useTotalShareInUst;
