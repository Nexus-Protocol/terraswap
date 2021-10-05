import { useMemo } from "react";
import { BN } from "@arthuryeti/terra";

import { useShareOfPool } from "./useShareOfPool";
import { PoolResponse } from "../../types";

type Params = {
  pool: PoolResponse;
  amount1: string;
};

export const useTokensToLp: any = ({ pool, amount1 }: Params) => {
  const shareOfPool = useShareOfPool({ pool, amount1 });

  return useMemo(() => {
    if (
      pool == null ||
      amount1 == null ||
      shareOfPool == null ||
      BN(amount1).isEqualTo(0)
    ) {
      return null;
    }

    return BN(shareOfPool).times(pool.total_share).toFixed();
  }, [pool, amount1]);
};

export default useTokensToLp;
