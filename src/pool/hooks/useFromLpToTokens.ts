import { useMemo } from "react";
import { BN } from "@arthuryeti/terra";

import { getTokenDenom } from "../../asset";
import { PoolResponse } from "../../types";

type Params = {
  pool: PoolResponse;
  amount: string;
};

export const useFromLpToTokens: any = ({ pool, amount }: Params) => {
  return useMemo(() => {
    if (pool == null || amount == null || BN(amount).isEqualTo(0)) {
      return null;
    }

    const { assets, total_share } = pool;

    return assets.reduce(
      (acc, asset) => ({
        ...acc,
        [getTokenDenom(asset.info)]: BN(amount)
          .times(asset.amount)
          .div(total_share)
          .toFixed(),
      }),
      {}
    );
  }, [pool, amount]);
};

export default useFromLpToTokens;
