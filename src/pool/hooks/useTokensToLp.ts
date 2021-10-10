import { useMemo } from "react";
import { num } from "@arthuryeti/terra";

import { PoolResponse } from "../../types";
import { useShareOfPool } from "./useShareOfPool";

type Params = {
  pool: PoolResponse | null;
  amount1: string | null;
};

export const useTokensToLp = ({ pool, amount1 }: Params): string | null => {
  const shareOfPool = useShareOfPool({ pool, amount1 });

  return useMemo(() => {
    if (
      pool == null ||
      amount1 == null ||
      shareOfPool == null ||
      num(amount1).isEqualTo(0)
    ) {
      return null;
    }

    return num(shareOfPool).times(pool.total_share).toFixed();
  }, [pool, shareOfPool, amount1]);
};

export default useTokensToLp;
