import { useMemo } from "react";
import { Coin } from "@terra-money/terra.js";
import { useTransaction, useAddress } from "@arthuryeti/terra";

import createProvideMsgs from "../createProvideMsgs";
import { PoolResponse } from "../../types";

type Params = {
  pool: PoolResponse;
  contract: string;
  token1: string;
  amount1: string;
  token2: string;
  amount2: string;
  onSuccess: any;
};

export const useProvide = ({
  contract,
  pool,
  token1,
  token2,
  amount1,
  amount2,
  onSuccess,
}: Params) => {
  const address = useAddress();

  const msgs = useMemo(() => {
    if (pool == null || amount1 == null || amount2 == null) {
      return;
    }

    return createProvideMsgs(
      {
        contract,
        pool,
        coin1: new Coin(token1, amount1),
        coin2: new Coin(token2, amount2),
        slippage: "0.02",
      },
      address
    );
  }, [address, contract, pool, token1, token2, amount1, amount2]);

  const { submit, ...rest } = useTransaction({
    msgs,
    onSuccess,
  });

  return {
    ...rest,
    provideLiquidity: submit,
  };
};

export default useProvide;
