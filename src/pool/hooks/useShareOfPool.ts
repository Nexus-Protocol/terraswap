import { useMemo } from "react";
import { BN } from "@arthuryeti/terra";

import { getTokenAmount } from "../../asset";
import { PoolResponse } from "../../types";

type Params = {
  pool: PoolResponse;
  amount1: string;
};

export const useShareOfPool = ({ pool, amount1 }: Params) => {
  return useMemo(() => {
    if (pool == null || amount1 == null || BN(pool.total_share).isEqualTo(0)) {
      return null;
    }

    const token1Amount = getTokenAmount(pool?.assets[0].info);

    return BN(amount1).div(token1Amount).toFixed(2);
  }, [pool, amount1]);
};

export default useShareOfPool;
